import * as XLSX from "xlsx"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../../types/Product"
import { v4 as uuid } from "uuid"
import { countries } from "../../types/country"
import { productCategories } from "../../types/productCategory"
import { businesses } from "../../types/business"
import { materials as allMaterials } from "../../types/material"
import { accessories as allAccessories } from "../../types/accessory"
import { Accessory, Material, Product, ProductInformation } from "@prisma/client"
import { Status } from "@prisma/enums"
import { impressions } from "../../types/impression"
import { FileUpload } from "../../../db/upload"
import { encryptProductFields } from "../../encryption/encryption"
import { hashProduct, ProductInformationForHash } from "../../encryption/hash"
import { checkHeaders, getBooleanValue, getNumberValue, getValue, trimsColumnValues } from "../parsing"
import { getAuthorizedBrands } from "../../organization/brands"
import { getProductConfidenceLevel } from "../../product/confidence"

export const parseExcel = async (buffer: Buffer, upload: NonNullable<FileUpload>) => {
  const products: Product[] = []
  const informations: (ProductInformation & { materials: undefined; accessories: undefined })[] = []
  const materials: Material[] = []
  const accessories: Accessory[] = []

  const workbook = XLSX.read(buffer, { type: "buffer" })

  let worksheet = workbook.Sheets["Produits"]
  if (!worksheet) {
    const firstSheetName = workbook.SheetNames[0]
    worksheet = workbook.Sheets[firstSheetName]
  }

  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

  if (data.length === 0) {
    throw new Error("Le fichier Excel est vide")
  }

  const headers = data[0]
  const formattedHeaders = checkHeaders(headers)
  const hasAccessoire1 = formattedHeaders.includes("accessoire1")

  const headerMapping: Record<string, number> = {}
  formattedHeaders.forEach((header, index) => {
    headerMapping[header] = index
  })

  const now = new Date()
  const productsByGtins = {} as Record<string, { product: Product; raw: ProductInformationForHash[] }>
  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex].map((cell) => (cell !== null && cell !== undefined ? cell.toString().trim() : ""))

    if (!row || row.length === 0 || row.every((cell) => !cell)) {
      continue
    }

    const gtins = (row[headerMapping["gtinseans"]] || "").split(/[,;\n]/).map((gtin) => gtin.trim())
    const internalReference = row[headerMapping["referenceinterne"]] || ""
    const brand = (
      row[headerMapping["marqueid"]] ||
      upload.createdBy.organization?.brands.find((brand) => brand.default)?.id ||
      ""
    ).trim()
    const declaredScore = getNumberValue(row[headerMapping["score"]] || "", 1, -1) as number | undefined

    const gtin = gtins.sort((a, b) => a.localeCompare(b)).join(",")
    const existingProduct = productsByGtins[gtin]

    const id = uuid()
    const productId = existingProduct ? existingProduct.product.id : uuid()

    const mainComponentValue = getBooleanValue(row[headerMapping["composantprincipal"]])
    const mainComponentError = typeof mainComponentValue === "string"
    const mainComponent = mainComponentError ? undefined : mainComponentValue

    const rawProduct = {
      mainComponent,
      product: getValue<ProductCategory>(productCategories, row[headerMapping["categorie"]]),
      airTransportRatio: getNumberValue(row[headerMapping["partdutransportaerien"]] || ""),
      business: getValue<Business>(businesses, row[headerMapping["tailledelentreprise"]]),
      fading: getBooleanValue(row[headerMapping["delavage"]]) as string | boolean | undefined,
      mass: getNumberValue(row[headerMapping["masse"]] || ""),
      numberOfReferences: getNumberValue(row[headerMapping["nombredereferences"]] || ""),
      price: getNumberValue(row[headerMapping["prix"]]),
      countryDyeing: getValue<Country>(countries, row[headerMapping["originedelennoblissementimpression"]]),
      countryFabric: getValue<Country>(countries, row[headerMapping["originedetissagetricotage"]]),
      countryMaking: getValue<Country>(countries, row[headerMapping["originedeconfection"]]),
      countrySpinning: getValue<Country>(countries, row[headerMapping["originedefilature"]]),
      printing:
        row[headerMapping["typedimpression"]] || row[headerMapping["pourcentagedimpression"]]
          ? {
              kind: getValue<Impression>(impressions, row[headerMapping["typedimpression"]]),
              ratio: getNumberValue(row[headerMapping["pourcentagedimpression"]] || ""),
            }
          : undefined,
      upcycled: getBooleanValue(row[headerMapping["remanufacture"]]) as string | boolean | undefined,
      materials: Array.from({ length: 16 })
        .map((_, index) => {
          const id = getValue<MaterialType>(allMaterials, row[headerMapping[`matiere${index + 1}`]])
          const shareRaw = row[headerMapping[`matiere${index + 1}pourcentage`]]
          const share = shareRaw ? getNumberValue(shareRaw) : undefined
          const country = getValue<Country>(countries, row[headerMapping[`matiere${index + 1}origine`]])
          return id ? { id, share, country } : null
        })
        .filter((material) => material !== null)
        .filter((material) => material.id),
      trims: hasAccessoire1
        ? Array.from({ length: 4 })
            .map((_, index) => {
              const id = getValue<AccessoryType>(allAccessories, row[headerMapping[`accessoire${index + 1}`]])
              const quantity = getNumberValue(row[headerMapping[`accessoire${index + 1}quantite`]])
              return id ? { id, quantity } : null
            })
            .filter((accessory) => accessory !== null)
            .filter((accessory) => accessory.id)
        : trimsColumnValues
            .map((key) => ({
              id: getValue<AccessoryType>(allAccessories, key.replace("quantitede", "")),
              quantity: getNumberValue(row[headerMapping[key]]),
            }))
            .filter((trim) => trim.quantity !== undefined),
    }

    const encrypted = encryptProductFields(rawProduct)
    encrypted.materials.forEach((material) => {
      materials.push({
        id: uuid(),
        productId: id,
        ...material,
      })
    })

    encrypted.accessories?.forEach((accessory) => {
      accessories.push({
        id: uuid(),
        productId: id,
        ...accessory,
      })
    })

    const authorizedBrands = upload.createdBy.organization
      ? getAuthorizedBrands(upload.createdBy.organization)
      : ([] as string[])

    const confidenceLevel = getProductConfidenceLevel(upload.createdBy, brand)

    const product = {
      error: mainComponentError ? "Composant principal doit valoir 'Oui' ou 'Non'" : null,
      id: productId,
      score: null,
      standardized: null,
      hash: hashProduct(
        {
          gtins,
          internalReference,
          brandId: brand,
          declaredScore,
          confidenceLevel,
        },
        [rawProduct],
        authorizedBrands,
      ),
      createdAt: now,
      uploadId: upload ? upload.id : "",
      uploadOrder: rowIndex,
      status: mainComponentError ? Status.Error : Status.Pending,
      gtins: gtins,
      internalReference: internalReference,
      brandName: brand,
      brandId: authorizedBrands.includes(brand) ? brand : null,
      declaredScore: declaredScore || null,
      confidenceLevel,
    }

    if (existingProduct) {
      existingProduct.raw.push(rawProduct)
      existingProduct.product.hash = hashProduct(
        {
          gtins: product.gtins,
          internalReference: product.internalReference,
          brandId: product.brandId || "",
          declaredScore: product.declaredScore || undefined,
          confidenceLevel,
        },
        existingProduct.raw,
        authorizedBrands,
      )

      const errors = []
      if (existingProduct.product.internalReference !== product.internalReference) {
        errors.push("La référence interne doit être identique pour toutes les composantes du produit")
      }
      if (existingProduct.product.declaredScore !== product.declaredScore) {
        errors.push("Le score déclaré doit être identique pour toutes les composantes du produit")
      }
      if (existingProduct.product.brandName !== product.brandName) {
        errors.push("La marque doit être identique pour toutes les composantes du produit")
      }
      if (existingProduct.raw[0].price !== rawProduct.price) {
        errors.push("Le prix doit être identique pour toutes les composantes du produit")
      }
      if (existingProduct.raw[0].numberOfReferences !== rawProduct.numberOfReferences) {
        errors.push("Le nombre de références doit être identique pour toutes les composantes du produit")
      }
      if (
        rawProduct.mainComponent === true &&
        existingProduct.raw.some((component) => component.mainComponent === true)
      ) {
        errors.push("Il ne peut y avoir qu'un seul composant principal par produit")
      }

      if (errors.length > 0) {
        existingProduct.product.status = Status.Error
        existingProduct.product.error = errors.join(", ")
      }
    } else {
      productsByGtins[gtin] = { product, raw: [rawProduct] }
      products.push(product)
    }

    informations.push({
      id,
      productId,
      emptyTrims: !hasAccessoire1 && rawProduct.trims.length === 0,
      ...encrypted.product,
    })
  }
  for (const { product, raw } of Object.values(productsByGtins)) {
    if (raw.findIndex((component) => component.mainComponent === true) !== -1) {
      if (raw.findIndex((component) => component.product !== raw[0].product) !== -1) {
        product.status = Status.Error
        product.error = "Tous les composants du produit doivent avoir la même catégorie"
      }
    }
  }

  return { products, informations, materials, accessories }
}
