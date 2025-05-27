import { parse } from "csv-parse"
import {
  AccessoryType,
  Business,
  Country,
  Impression,
  MaterialType,
  ProductCategory,
  ProductWithMaterialsAndAccessories,
} from "../../types/Product"
import { v4 as uuid } from "uuid"
import { materials } from "../types/material"
import { countries } from "../types/country"
import { productCategories } from "../types/productCategory"
import { businesses } from "../types/business"
import { Status } from "../../../prisma/src/prisma"
import { impressions } from "../types/impression"
import { accessories } from "../types/accessory"
import { Readable } from "stream"

type ColumnType = [
  "identifiant",
  "datedemisesurlemarche",
  "marque",
  "score",
  "categorie",
  "masse",
  "remanufacture",
  "nombredereferences",
  "prix",
  "tailledelentreprise",
  "tracabilitegeographique",
  "matiere1",
  "matiere1pourcentage",
  "matiere1origine",
  "matiere2",
  "matiere2pourcentage",
  "matiere2origine",
  "matiere3",
  "matiere3pourcentage",
  "matiere3origine",
  "matiere4",
  "matiere4pourcentage",
  "matiere4origine",
  "matiere5",
  "matiere5pourcentage",
  "matiere5origine",
  "matiere6",
  "matiere6pourcentage",
  "matiere6origine",
  "matiere7",
  "matiere7pourcentage",
  "matiere7origine",
  "matiere8",
  "matiere8pourcentage",
  "matiere8origine",
  "matiere9",
  "matiere9pourcentage",
  "matiere9origine",
  "matiere10",
  "matiere10pourcentage",
  "matiere10origine",
  "matiere11",
  "matiere11pourcentage",
  "matiere11origine",
  "matiere12",
  "matiere12pourcentage",
  "matiere12origine",
  "matiere13",
  "matiere13pourcentage",
  "matiere13origine",
  "matiere14",
  "matiere14pourcentage",
  "matiere14origine",
  "matiere15",
  "matiere15pourcentage",
  "matiere15origine",
  "matiere16",
  "matiere16pourcentage",
  "matiere16origine",
  "originedefilature",
  "originedetissagetricotage",
  "originedelennoblissementimpression",
  "typedimpression",
  "pourcentagedimpression",
  "origineconfection",
  "delavage",
  "partdutransportaerien",
  "accessoire1",
  "accessoire1quantite",
  "accessoire2",
  "accessoire2quantite",
  "accessoire3",
  "accessoire3quantite",
  "accessoire4",
  "accessoire4quantite",
]

type CSVRow = Record<ColumnType[number], string>

const columns: Partial<Record<ColumnType[number], string>> = {
  identifiant: "Identifiant",
  datedemisesurlemarche: "Date de mise sur le marché",
  categorie: "Catégorie",
  masse: "Masse",
  remanufacture: "Remanufacturé",
  nombredereferences: "Nombre de références",
  prix: "Prix",
  tailledelentreprise: "Taille de l'entreprise",
  tracabilitegeographique: "Traçabilité géographique",
  matiere1: "Matière 1",
  matiere1pourcentage: "Matière 1 pourcentage",
  matiere1origine: "Matière 1 origine",
  originedefilature: "Origine de filature",
  originedetissagetricotage: "Origine de tissage/tricotage",
  originedelennoblissementimpression: "Origine de l'ennoblissement/impression",
  typedimpression: "Type d'impression",
  pourcentagedimpression: "Pourcentage d'impression",
  origineconfection: "Origine confection",
  delavage: "Délavage",
  partdutransportaerien: "Part du transport aérien",
  accessoire1: "Accessoire 1",
  accessoire1quantite: "Accessoire 1 quantité",
}

const columnsValues = Object.keys(columns)

const simplifyValue = (value: string | null) =>
  value
    ? value
        .trim()
        .toLowerCase()
        .replace(/[ \/'()]/g, "")
        .replace(/[éè]/g, "e")
        .replace(/ç/g, "c")
    : ""

const checkHeaders = (headers: string[]) => {
  const formattedHeaders = headers.map((header) => simplifyValue(header))

  const missingHeaders = columnsValues.filter((header) => !formattedHeaders.includes(header))
  if (missingHeaders.length > 0) {
    throw new Error(
      `Colonne(s) manquante(s): ${missingHeaders.map((header) => columns[header as keyof typeof columns]).join(", ")}`,
    )
  }

  return formattedHeaders
}

const getValue = <T,>(mapping: Record<string, T>, key: string): T => {
  const simplifiedKey = simplifyValue(key)
  const value = mapping[simplifiedKey]
  if (value !== undefined) {
    return value
  }
  return key as T
}

const getBooleanValue = (value: string) => {
  if (value === "") {
    return undefined
  }

  const simplifiedValue = simplifyValue(value)
  if (simplifiedValue === "oui" || simplifiedValue === "yes" || simplifiedValue === "true") {
    return true
  } else if (simplifiedValue === "non" || simplifiedValue === "no" || simplifiedValue === "false") {
    return false
  }
  return value
}

const getNumberValue = (value: string, factor?: number, defaultValue?: number) => {
  if (value === "") {
    return undefined
  }

  const result = parseFloat(simplifyValue(value).replace(",", "."))
  return isNaN(result) ? defaultValue || value : result * (factor || 1)
}

const delimiters = [",", ";", "\t"]
export const parseCSV = async (file: File, encoding: string | null, uploadId: string) => {
  console.log("Memory:", process.memoryUsage().heapUsed / 1024 / 1024, "MB")
  const buffer = Buffer.from(await file.arrayBuffer())

  let bestDelimiter = ","

  for (const delimiter of delimiters) {
    const stream = Readable.from(buffer)

    try {
      await new Promise<void>((resolve, reject) => {
        const parser = parse({
          columns: (headers: string[]) => checkHeaders(headers),
          delimiter,
          to_line: 1,
          skip_empty_lines: true,
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
  const rows: CSVRow[] = []

  await new Promise<void>((resolve, reject) => {
    const parser = parse({
      columns: (headers: string[]) => checkHeaders(headers),
      delimiter: bestDelimiter,
      skip_empty_lines: true,
      trim: true,
      bom: true,
      encoding: (encoding as BufferEncoding) || "utf-8",
    })

    stream.pipe(parser)

    parser.on("data", (row) => {
      rows.push(row)
    })

    parser.on("end", () => resolve())
    parser.on("error", reject)
    stream.on("error", reject)
  })

  return rows.map((row) => {
    const productId = uuid()
    const now = new Date()
    const date = Date.parse(row["datedemisesurlemarche"])
    return {
      id: productId,
      createdAt: now,
      updatedAt: now,
      uploadId,
      status: Status.Pending,
      gtin: row["identifiant"],
      date: Number.isNaN(date) ? null : new Date(date),
      brand: row["marque"],
      declaredScore: getNumberValue(row["score"], 1, -1),
      category: getValue<ProductCategory>(productCategories, row["categorie"]),
      airTransportRatio: getNumberValue(row["partdutransportaerien"], 0.01),
      business: getValue<Business>(businesses, row["tailledelentreprise"]),
      fading: getBooleanValue(row["delavage"]),
      mass: getNumberValue(row["masse"]),
      numberOfReferences: parseInt(row["nombredereferences"]),
      price: getNumberValue(row["prix"]),
      traceability: getBooleanValue(row["tracabilitegeographique"]),
      countryDyeing: getValue<Country>(countries, row["originedelennoblissementimpression"]),
      countryFabric: getValue<Country>(countries, row["originedetissagetricotage"]),
      countryMaking: getValue<Country>(countries, row["origineconfection"]),
      countrySpinning: getValue<Country>(countries, row["originedefilature"]),
      impression: getValue<Impression>(impressions, row["typedimpression"]),
      impressionPercentage: getNumberValue(row["pourcentagedimpression"].trim().replace("%", ""), 0.01),
      upcycled: getBooleanValue(row["remanufacture"]),
      materials: Array.from({ length: 16 })
        .map((_, index) => ({
          id: uuid(),
          productId,
          //@ts-expect-error : managed from 1 to 16
          slug: getValue<MaterialType>(materials, row[`matiere${index + 1}`]),
          //@ts-expect-error : managed from 1 to 16
          share: getNumberValue(row[`matiere${index + 1}pourcentage`].trim().replace("%", "")) / 100,
          //@ts-expect-error : managed from 1 to 16
          country: getValue<Country>(countries, row[`matiere${index + 1}origine`]),
        }))
        .filter((material) => material.slug),
      accessories: Array.from({ length: 4 })
        .map((_, index) => ({
          id: uuid(),
          productId,
          //@ts-expect-error : managed from 1 to 4
          slug: getValue<AccessoryType>(accessories, row[`accessoire${index + 1}`]),
          //@ts-expect-error : managed from 1 to 4
          quantity: getNumberValue(row[`accessoire${index + 1}quantite`]),
        }))
        .filter((accessory) => accessory.slug),
    } as ProductWithMaterialsAndAccessories
  })
}
