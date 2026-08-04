import { parse } from "csv-parse"
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
import { Readable } from "stream"
import { FileUpload } from "../../../db/upload"
import { encryptProductFields } from "../../encryption/encryption"
import { checkHeaders, ColumnType, getBooleanValue, getNumberValue, getValue, trimsColumnValues } from "../parsing"
import { getAuthorizedBrands } from "../../organization/brands"
import { hashProduct, ProductInformationForHash } from "../../encryption/hash"
import { getProductConfidenceLevel } from "../../product/confidence"

type CSVRow = {
  info: { records: number }
  record: Record<ColumnType[number], string>
}
const delimiters = [",", ";", "\t"]

const estimateBestDelimiter = (fileStart: string): string => {
  const counts = delimiters.reduce((acc, value) => ({ ...acc, [value]: 0 }), {} as Record<string, number>)

  for (const char of fileStart) {
    if (delimiters.includes(char)) {
      counts[char]++
    }
  }

  let bestDelimiter = delimiters[0]
  let maxCount = 0

  for (const delimiter of delimiters) {
    if (counts[delimiter] > maxCount) {
      bestDelimiter = delimiter
      maxCount = counts[delimiter]
    }
  }
  return bestDelimiter
}

export const parseCSV = async (buffer: Buffer, encoding: string | null, upload: NonNullable<FileUpload>) => {
  const encodingToUse = (encoding as BufferEncoding) || "utf-8"

  const fileStart = buffer.toString("utf8", 0, Math.min(buffer.length, 1024))

  let bestDelimiter = estimateBestDelimiter(fileStart)

  for (const delimiter of delimiters) {
    const stream = Readable.from(buffer)

    try {
      await new Promise<void>((resolve, reject) => {
        const parser = parse({
          columns: (headers: string[]) => checkHeaders(headers),
          delimiter,
          to_line: 1,
          skip_empty_lines: true,
          encoding: encodingToUse,
        })

        stream.pipe(parser)

        parser.on("data", () => {})
        parser.on("end", () => resolve())
        parser.on("error", reject)
        stream.on("error", reject)
      })

      bestDelimiter = delimiter
      break
    } catch {
      stream.destroy()
    }
  }

  const stream = Readable.from(buffer)
  const products: Product[] = []
  const informations: (ProductInformation & { materials: undefined; accessories: undefined })[] = []
  const materials: Material[] = []
  const accessories: Accessory[] = []

  let hasAccessoire1 = false

  const now = new Date()
  const productsByGtins = {} as Record<string, { product: Product; raw: ProductInformationForHash[] }>
  await new Promise<void>((resolve, reject) => {
    const parser = parse({
      columns: (headers: string[]) => {
        const availableHeaders = checkHeaders(headers)
        hasAccessoire1 = availableHeaders.includes("accessoire1")
        return availableHeaders
      },
      delimiter: bestDelimiter,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      encoding: encodingToUse,
      info: true,
    })

    stream.pipe(parser)

    parser.on("data", (row: CSVRow) => {
      const gtins = (row.record["gtinseans"] || "").split(";").map((gtin) => gtin.trim())
      const internalReference = row.record["referenceinterne"] || ""
      const brand = (
        row.record["marqueid"] ||
        upload.createdBy.organization?.brands.find((brand) => brand.default)?.id ||
        ""
      ).trim()
      const declaredScore = getNumberValue(row.record["score"], 1, -1) as number | undefined

      const gtin = gtins.sort((a, b) => a.localeCompare(b)).join(",")
      const existingProduct = productsByGtins[gtin]

      const id = uuid()
      const productId = existingProduct ? existingProduct.product.id : uuid()

      const mainComponentValue = getBooleanValue(row.record["composantprincipal"])
      const mainComponentError = typeof mainComponentValue === "string"
      const mainComponent = mainComponentError ? undefined : mainComponentValue

      const rawProduct = {
        mainComponent,
        product: getValue<ProductCategory>(productCategories, row.record["categorie"]),
        airTransportRatio: getNumberValue(row.record["partdutransportaerien"], 0.01),
        business: getValue<Business>(businesses, row.record["tailledelentreprise"]),
        fading: getBooleanValue(row.record["delavage"]),
        mass: getNumberValue(row.record["masse"]),
        numberOfReferences: getNumberValue(row.record["nombredereferences"]),
        price: getNumberValue(row.record["prix"]),
        countryDyeing: getValue<Country>(countries, row.record["originedelennoblissementimpression"]),
        countryFabric: getValue<Country>(countries, row.record["originedetissagetricotage"]),
        countryMaking: getValue<Country>(countries, row.record["originedeconfection"]),
        countrySpinning: getValue<Country>(countries, row.record["originedefilature"]),
        printing:
          row.record["typedimpression"] || row.record["pourcentagedimpression"]
            ? {
                kind: getValue<Impression>(impressions, row.record["typedimpression"]),
                ratio: getNumberValue((row.record["pourcentagedimpression"] || "").trim().replace("%", ""), 0.01),
              }
            : undefined,
        upcycled: getBooleanValue(row.record["remanufacture"]),
        materials: Array.from({ length: 16 })
          .map((_, index) => {
            //@ts-expect-error : managed from 1 to 16
            const id = getValue<MaterialType>(allMaterials, row.record[`matiere${index + 1}`])
            //@ts-expect-error : managed from 1 to 16
            const shareRaw = row.record[`matiere${index + 1}pourcentage`]
            const share = shareRaw ? getNumberValue(shareRaw.trim().replace("%", "")) : undefined
            //@ts-expect-error : managed from 1 to 16
            const country = getValue<Country>(countries, row.record[`matiere${index + 1}origine`])
            return id ? { id, share: typeof share === "number" ? share / 100 : share, country } : null
          })
          .filter((material) => material !== null)
          .filter((material) => material.id),
        trims: hasAccessoire1
          ? Array.from({ length: 4 })
              .map((_, index) => {
                //@ts-expect-error : managed from 1 to 4
                const id = getValue<AccessoryType>(allAccessories, row.record[`accessoire${index + 1}`])
                //@ts-expect-error : managed from 1 to 4
                const quantity = getNumberValue(row.record[`accessoire${index + 1}quantite`])
                return id ? { id, quantity } : null
              })
              .filter((accessory) => accessory !== null)
              .filter((accessory) => accessory.id)
          : trimsColumnValues
              .map((key) => ({
                id: getValue<AccessoryType>(allAccessories, key.replace("quantitede", "")),
                quantity: getNumberValue(row.record[key]),
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
        uploadId: upload.id,
        uploadOrder: row.info.records,
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
    })

    parser.on("end", () => {
      for (const { product, raw } of Object.values(productsByGtins)) {
        if (raw.findIndex((component) => component.mainComponent === true) !== -1) {
          if (raw.findIndex((component) => component.product !== raw[0].product) !== -1) {
            product.status = Status.Error
            product.error = "Tous les composants du produit doivent avoir la même catégorie"
          }
        }
      }

      resolve()
    })
    parser.on("error", reject)
    stream.on("error", reject)
  })

  return { products, informations, materials, accessories }
}
