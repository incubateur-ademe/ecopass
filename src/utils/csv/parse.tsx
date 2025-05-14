import { Status } from "../../../prisma/src/prisma"
import { parse } from "csv-parse/sync"
import {
  AccessoryType,
  allAccessoryTypes,
  allCountries,
  allMaterialTypes,
  allProductTypes,
  Business,
  Country,
  MaterialType,
  ProductType,
  ProductWithMaterialsAndAccessories,
} from "../../types/Product"
import { v4 as uuid } from "uuid"
import { businesses } from "../types/business"

const columns: Record<string, string> = {
  identifiant: "Identifiant",
  datedemisesurlemarche: "Date de mise sur le marché",
  type: "Type",
  masse: "Masse",
  remanufacture: "Remanufacturé",
  nombredereferences: "Nombre de références",
  prix: "Prix",
  tailledelentreprise: "Taille de l'entreprise",
  traçabilitegeographiqe: "Traçabilité géographiqe",
  matieres: "Matières",
  originedesmatieres: "Origine des matières",
  originedefilature: "Origine de filature",
  originedetissagetricotage: "Origine de tissage/tricotage",
  originedelennoblissementimpression: "Origine de l'ennoblissement/impression",
  typedimpression: "Type d'impression",
  origineconfection: "Origine confection",
  delavage: "Délavage",
  partdutransportaerien: "Part du transport aérien",
  accessoires: "Accessoires",
}

const columnsValues = Object.keys(columns)
type CSVRow = Record<(typeof columnsValues)[number], string>

const simplifyValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[ \/']/g, "")
    .replace(/[éè]/g, "e")
    .replace(/ç/g, "c")

const checkHeaders = (headers: string[]) => {
  const formattedHeaders = headers.map((header) => simplifyValue(header))

  const missingHeaders = columnsValues.filter((header) => !formattedHeaders.includes(header))
  if (missingHeaders.length > 0) {
    throw new Error(`Colonne(s) manquante(s): ${missingHeaders.map((header) => columns[header]).join(", ")}`)
  }
}

const getBusiness = (business: string): Business => {
  const value = businesses[simplifyValue(business)]
  if (value) {
    return value as Business
  }
  throw new Error(`Business inconnu: ${business}`)
}
const getMaterialType = (material: string): MaterialType => {
  const value = allMaterialTypes.find((type) => simplifyValue(type) === simplifyValue(material))
  if (value) {
    return value as MaterialType
  }
  throw new Error(`MaterialType inconnu: ${material}`)
}

const getProductType = (type: string): ProductType => {
  const value = allProductTypes.find((productType) => simplifyValue(productType) === simplifyValue(type))
  if (value) {
    return value as ProductType
  }
  throw new Error(`ProductType inconnu: ${type}`)
}

const getAccessoryType = (accessory: string): AccessoryType => {
  const value = allAccessoryTypes.find((type) => simplifyValue(type) === simplifyValue(accessory))
  if (value) {
    return value as AccessoryType
  }
  throw new Error(`AccessoryType inconnu: ${accessory}`)
}

const getCountry = (country: string): Country => {
  const value = allCountries.find((type) => simplifyValue(type) === simplifyValue(country))
  if (value) {
    return value as Country
  }
  throw new Error(`Country inconnu: ${country}`)
}

export const parseCSV = async (content: string, uploadId: string) => {
  const rows = parse(content, {
    columns: (headers: string[]) => {
      checkHeaders(headers)
      return headers
    },
    delimiter: ",",
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CSVRow[]

  return rows.map((row) => {
    const productId = uuid()
    const now = new Date()
    const materials: ProductWithMaterialsAndAccessories["materials"] = row["Matières"].split(",").map((material) => {
      const [id, share] = material.trim().split(";")
      return {
        id: uuid(),
        productId,
        slug: getMaterialType(id),
        share: parseFloat(share.trim().replace("%", "")) / 100,
      }
    })
    row["Origine des matières"].split(",").forEach((material) => {
      const [id, origin] = material.trim().split(";")
      materials.find((existingMaterial) => existingMaterial.slug === getMaterialType(id))!.country = getCountry(origin)
    })

    const product: ProductWithMaterialsAndAccessories = {
      id: productId,
      createdAt: now,
      updatedAt: now,
      uploadId,
      status: Status.Pending,
      ean: row["Identifiant"],
      type: getProductType(row["Type"]),
      airTransportRatio: parseFloat(row["Part du transport aérien"]) / 100,
      business: getBusiness(row["Taille de l'entreprise"]),
      fading: row["Délavage"] === "Oui",
      mass: parseFloat(row["Masse"]),
      numberOfReferences: parseInt(row["Nombre de références"]),
      price: parseFloat(row["Prix"]),
      traceability: row["Traçabilité géographiqe"] === "Oui",
      countryDyeing: getCountry(row["Origine de l'ennoblissement/impression"]),
      countryFabric: getCountry(row["Origine de tissage/tricotage"]),
      countryMaking: getCountry(row["Origine confection"]),
      countrySpinning: getCountry(row["Origine de filature"]),
      upcycled: row["Remanufacturé"] === "Oui",
      accessories: row["Accessoires"]
        .split(",")
        .filter((accessory) => accessory.trim())
        .map((accessory) => {
          const [id, quantity] = accessory.trim().split(";")
          return {
            id: uuid(),
            productId,
            slug: getAccessoryType(id.trim()),
            quantity: parseFloat(quantity.trim()),
          }
        }),
      materials,
    }

    return product
  })
}
