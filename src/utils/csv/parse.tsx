import { Status } from "../../../prisma/src/prisma"
import { parse } from "csv-parse/sync"
import {
  AccessoryType,
  allAccessoryTypes,
  allBusinesses,
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

const columns = [
  "Identifiant",
  "Date de mise sur le marché",
  "Type",
  "Masse",
  "Remanufacturé",
  "Nombre de références",
  "Prix",
  "Taille de l'entreprise",
  "Traçabilité géographiqe",
  "Matières",
  "Origine des matières",
  "Origine de filature",
  "Origine de tissage/tricotage",
  "Origine de l'ennoblissement/impression",
  "Type d'impression",
  "Origine confection",
  "Délavage",
  "Part du transport aérien",
  "Accessoires",
] as const

type CSVRow = Record<(typeof columns)[number], string>

const checkHeaders = (headers: string[]) => {
  const missingHeaders = columns.filter((header) => !headers.includes(header))
  if (missingHeaders.length > 0) {
    throw new Error(`Colonne(s) manquante(s): ${missingHeaders.join(", ")}`)
  }
}

const getBusiness = (business: string): Business => {
  if (allBusinesses.map((type) => type.toLowerCase()).includes(business.toLowerCase())) {
    return business as Business
  }
  throw new Error(`Business inconnu: ${business}`)
}

const getMaterialType = (material: string): MaterialType => {
  if (allMaterialTypes.map((type) => type.toLowerCase()).includes(material.toLowerCase())) {
    return material as MaterialType
  }
  throw new Error(`MaterialType inconnu: ${material}`)
}

const getProductType = (type: string): ProductType => {
  if (allProductTypes.map((type) => type.toLowerCase()).includes(type.toLowerCase())) {
    return type as ProductType
  }
  throw new Error(`ProductType inconnu: ${type}`)
}

const getAccessoryType = (accessory: string): AccessoryType => {
  if (allAccessoryTypes.map((type) => type.toLowerCase()).includes(accessory.toLowerCase())) {
    return accessory as AccessoryType
  }
  throw new Error(`AccessoryType inconnu: ${accessory}`)
}

const getCountry = (country: string): Country => {
  if (allCountries.map((type) => type.toLowerCase()).includes(country.toLowerCase())) {
    return country as Country
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
