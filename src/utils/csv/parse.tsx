import { parse } from "csv-parse/sync"
import {
  AccessoryType,
  Business,
  Country,
  MaterialType,
  ProductType,
  ProductWithMaterialsAndAccessories,
} from "../../types/Product"
import { v4 as uuid } from "uuid"
import { materials } from "../types/material"
import { countries } from "../types/country"
import { productTypes } from "../types/productType"
import { businesses } from "../types/business"
import { accessories } from "../types/accessory"

const columns: Record<string, string> = {
  identifiant: "Identifiant",
  datedemisesurlemarche: "Date de mise sur le marché",
  type: "Type",
  masse: "Masse",
  remanufacture: "Remanufacturé",
  nombredereferences: "Nombre de références",
  prix: "Prix",
  tailledelentreprise: "Taille de l'entreprise",
  tracabilitegeographique: "Traçabilité géographique",
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

const simplifyValue = (value: string | null) =>
  value
    ? value
        .trim()
        .toLowerCase()
        .replace(/[ \/']/g, "")
        .replace(/[éè]/g, "e")
        .replace(/ç/g, "c")
    : ""

const checkHeaders = (headers: string[]) => {
  const formattedHeaders = headers.map((header) => simplifyValue(header))

  const missingHeaders = columnsValues.filter((header) => !formattedHeaders.includes(header))
  if (missingHeaders.length > 0) {
    throw new Error(`Colonne(s) manquante(s): ${missingHeaders.map((header) => columns[header]).join(", ")}`)
  }

  return formattedHeaders.map((header) => columns[header])
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
  const simplifiedValue = simplifyValue(value)
  if (simplifiedValue === "oui" || simplifiedValue === "yes" || simplifiedValue === "true") {
    return true
  } else if (simplifiedValue === "non" || simplifiedValue === "no" || simplifiedValue === "false") {
    return false
  }
  return value
}

export const parseCSV = async (content: string, uploadId: string) => {
  const rows = parse(content, {
    columns: (headers: string[]) => {
      return checkHeaders(headers)
    },
    delimiter: ",",
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CSVRow[]

  return rows.map((row) => {
    const productId = uuid()
    const now = new Date()
    const productMaterials: ProductWithMaterialsAndAccessories["materials"] = row["Matières"]
      .split(",")
      .map((material) => {
        const [id, share] = material.trim().split(";")
        return {
          id: uuid(),
          productId,
          slug: getValue<MaterialType>(materials, id),
          share: parseFloat(share.trim().replace("%", "")) / 100,
        }
      })
    row["Origine des matières"].split(",").forEach((material) => {
      const [id, origin] = material.trim().split(";")
      productMaterials.find(
        (existingMaterial) => existingMaterial.slug === getValue<MaterialType>(materials, id),
      )!.country = getValue<Country>(countries, origin)
    })

    return {
      id: productId,
      createdAt: now,
      updatedAt: now,
      uploadId,
      ean: row["Identifiant"],
      type: getValue<ProductType>(productTypes, row["Type"]),
      airTransportRatio: parseFloat(row["Part du transport aérien"]) / 100,
      business: getValue<Business>(businesses, row["Taille de l'entreprise"]),
      fading: getBooleanValue(row["Délavage"]),
      mass: parseFloat(row["Masse"]),
      numberOfReferences: parseInt(row["Nombre de références"]),
      price: parseFloat(row["Prix"]),
      traceability: getBooleanValue(row["Traçabilité géographique"]),
      countryDyeing: getValue<Country>(countries, row["Origine de l'ennoblissement/impression"]),
      countryFabric: getValue<Country>(countries, row["Origine de tissage/tricotage"]),
      countryMaking: getValue<Country>(countries, row["Origine confection"]),
      countrySpinning: getValue<Country>(countries, row["Origine de filature"]),
      upcycled: getBooleanValue(row["Remanufacturé"]),
      materials: productMaterials,
      accessories: row["Accessoires"]
        .split(",")
        .filter((accessory) => accessory.trim())
        .map((accessory) => {
          const [id, quantity] = accessory.trim().split(";")
          return {
            id: uuid(),
            productId,
            slug: getValue<AccessoryType>(accessories, id.trim()),
            quantity: parseFloat(quantity.trim()),
          }
        }),
    } as ProductWithMaterialsAndAccessories
  })
}
