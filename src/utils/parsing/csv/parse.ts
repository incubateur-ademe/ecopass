import { parse } from "csv-parse"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../../types/Product"
import { v4 as uuid } from "uuid"
import { countries } from "../../types/country"
import { productCategories } from "../../types/productCategory"
import { businesses } from "../../types/business"
import { materials as allMaterials } from "../../types/material"
import { accessories as allAccessories } from "../../types/accessory"
import { Accessory, Material, Product, Status } from "../../../../prisma/src/prisma"
import { impressions } from "../../types/impression"
import { Readable } from "stream"
import { FileUpload } from "../../../db/upload"
import { encryptProductFields } from "../../encryption/encryption"
import { hashProduct } from "../../encryption/hash"
import { checkHeaders, ColumnType, getBooleanValue, getNumberValue, getValue } from "../parsing"
import { getAuthorizedBrands } from "../../organization/brands"

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
  const products: (Product & { materials: undefined; accessories: undefined })[] = []
  const materials: Material[] = []
  const accessories: Accessory[] = []

  const now = new Date()
  await new Promise<void>((resolve, reject) => {
    const parser = parse({
      columns: (headers: string[]) => checkHeaders(headers),
      delimiter: bestDelimiter,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      encoding: encodingToUse,
      info: true,
    })

    stream.pipe(parser)

    parser.on("data", (row: CSVRow) => {
      const productId = uuid()

      const rawProduct = {
        gtins: (row.record["gtinseans"] || "").split(";").map((gtin) => gtin.trim()),
        internalReference: row.record["referenceinterne"] || "",
        brand: (row.record["marque"] || upload.createdBy.organization?.name || "").trim(),
        declaredScore: getNumberValue(row.record["score"], 1, -1) as number | undefined,
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
        trims: Array.from({ length: 4 })
          .map((_, index) => {
            //@ts-expect-error : managed from 1 to 4
            const id = getValue<AccessoryType>(allAccessories, row.record[`accessoire${index + 1}`])
            //@ts-expect-error : managed from 1 to 4
            const quantity = getNumberValue(row.record[`accessoire${index + 1}quantite`])
            return id ? { id, quantity } : null
          })
          .filter((accessory) => accessory !== null)
          .filter((accessory) => accessory.id),
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
        hash: hashProduct(
          rawProduct,
          upload.createdBy.organization ? getAuthorizedBrands(upload.createdBy.organization) : [],
        ),
        createdAt: now,
        updatedAt: now,
        uploadId: upload.id,
        uploadOrder: row.info.records,
        status: Status.Pending,
        ...encrypted.product,
      })
    })

    parser.on("end", resolve)
    parser.on("error", reject)
    stream.on("error", reject)
  })

  return { products, materials, accessories }
}
