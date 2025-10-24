import * as XLSX from "xlsx"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../../types/Product"
import { v4 as uuid } from "uuid"
import { countries } from "../../types/country"
import { productCategories } from "../../types/productCategory"
import { businesses } from "../../types/business"
import { materials as allMaterials } from "../../types/material"
import { accessories as allAccessories } from "../../types/accessory"
import { Accessory, Material, Product, ProductInformation, Status } from "../../../../prisma/src/prisma"
import { impressions } from "../../types/impression"
import { FileUpload } from "../../../db/upload"
import { encryptProductFields } from "../../encryption/encryption"
import { hashParsedProduct } from "../../encryption/hash"
import { checkHeaders, getBooleanValue, getNumberValue, getValue, trimsColumnValues } from "../parsing"
import { getAuthorizedBrands } from "../../organization/brands"

export const parseExcel = async (buffer: Buffer, upload: FileUpload) => {
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

  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex].map((cell) => (cell ? cell.toString().trim() : ""))

    if (!row || row.every((cell) => !cell)) {
      continue
    }
    const id = uuid()
    const productId = uuid()

    const gtins = (row[headerMapping["gtinseans"]] || "").split(/[,;\n]/).map((gtin) => gtin.trim())
    const internalReference = row[headerMapping["referenceinterne"]] || ""
    const brand = (row[headerMapping["marque"]] || upload?.createdBy.organization?.name || "").trim()
    const declaredScore = getNumberValue(row[headerMapping["score"]] || "", 1, -1) as number | undefined

    const rawProduct = {
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
        productId,
        ...material,
      })
    })

    encrypted.accessories?.forEach((accessory) => {
      accessories.push({
        id: uuid(),
        productId,
        ...accessory,
      })
    })

    products.push({
      error: null,
      id: productId,
      score: null,
      standardized: null,
      hash: hashParsedProduct(
        {
          gtins: gtins,
          internalReference: internalReference,
          brand: brand,
          declaredScore: declaredScore,
        },
        rawProduct,
        upload?.createdBy.organization ? getAuthorizedBrands(upload.createdBy.organization) : [],
      ),
      createdAt: now,
      uploadId: upload ? upload.id : "",
      uploadOrder: rowIndex,
      status: Status.Pending,
      gtins: gtins,
      internalReference: internalReference,
      brand: brand,
      declaredScore: declaredScore || null,
    })

    informations.push({
      id: productId,
      productId: id,
      emptyTrims: !hasAccessoire1 && rawProduct.trims.length === 0,
      ...encrypted.product,
    })
  }

  return { products, informations, materials, accessories }
}
