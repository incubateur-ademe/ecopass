import { Status } from "../../../prisma/src/prisma"
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

const getValue = <T,>(mapping: Record<string, T>, key: string, typeName: string): T => {
  const simplifiedKey = simplifyValue(key)
  const value = mapping[simplifiedKey]
  if (value !== undefined) {
    return value
  }
  throw new Error(`${typeName} inconnu(e): ${key}`)
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
    const productMaterials: ProductWithMaterialsAndAccessories["materials"] = row["Matières"]
      .split(",")
      .map((material) => {
        const [id, share] = material.trim().split(";")
        return {
          id: uuid(),
          productId,
          slug: getValue<MaterialType>(materials, id, "Materière"),
          share: parseFloat(share.trim().replace("%", "")) / 100,
        }
      })
    row["Origine des matières"].split(",").forEach((material) => {
      const [id, origin] = material.trim().split(";")
      productMaterials.find(
        (existingMaterial) => existingMaterial.slug === getValue<MaterialType>(materials, id, "Materière"),
      )!.country = getValue<Country>(countries, origin, "Pays")
    })

    const product: ProductWithMaterialsAndAccessories = {
      id: productId,
      createdAt: now,
      updatedAt: now,
      uploadId,
      status: Status.Pending,
      ean: row["Identifiant"],
      type: getValue<ProductType>(productTypes, row["Type"], "Produit"),
      airTransportRatio: parseFloat(row["Part du transport aérien"]) / 100,
      business: getValue<Business>(businesses, row["Taille de l'entreprise"], "Business"),
      fading: row["Délavage"] === "Oui",
      mass: parseFloat(row["Masse"]),
      numberOfReferences: parseInt(row["Nombre de références"]),
      price: parseFloat(row["Prix"]),
      traceability: row["Traçabilité géographiqe"] === "Oui",
      countryDyeing: getValue<Country>(countries, row["Origine de l'ennoblissement/impression"], "Pays"),
      countryFabric: getValue<Country>(countries, row["Origine de tissage/tricotage"], "Pays"),
      countryMaking: getValue<Country>(countries, row["Origine confection"], "Pays"),
      countrySpinning: getValue<Country>(countries, row["Origine de filature"], "Pays"),
      upcycled: row["Remanufacturé"] === "Oui",
      accessories: row["Accessoires"]
        .split(",")
        .filter((accessory) => accessory.trim())
        .map((accessory) => {
          const [id, quantity] = accessory.trim().split(";")
          return {
            id: uuid(),
            productId,
            slug: getValue<AccessoryType>(accessories, id.trim(), "Accéssoire"),
            quantity: parseFloat(quantity.trim()),
          }
        }),
      materials: productMaterials,
    }

    return product
  })
}
