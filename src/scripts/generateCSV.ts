import fs from "fs"
import { faker } from "@faker-js/faker"
import { stringify } from "csv-stringify/sync"
import { productCategories } from "../utils/types/productCategory"
import { businesses } from "../utils/types/business"
import { countries } from "../utils/types/country"
import { materials } from "../utils/types/material"
import { accessories } from "../utils/types/accessory"
import { impressionMapping } from "../utils/ecobalyse/mappings"

const generateShares = () => {
  const n = Math.floor(Math.random() * 15) + 1

  const remaining = 100 - n

  const raw = Array.from({ length: n }, () => Math.random())
  const total = raw.reduce((sum, val) => sum + val, 0)

  const extra = raw.map((val) => Math.floor((val / total) * remaining))

  const currentSum = extra.reduce((sum, val) => sum + val, 0)
  let diff = remaining - currentSum

  while (diff > 0) {
    const i = Math.floor(Math.random() * n)
    extra[i]++
    diff--
  }

  return extra.map((val) => val + 1)
}

const generate = (name: string, length?: string) => {
  const numberOfRows = length ? parseInt(length) : 10000
  const products = Array.from({ length: numberOfRows }, () => {
    const materialsShare = generateShares()
    return {
      gtins: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => faker.string.numeric(13)),
      internalReference: faker.string.alphanumeric(10),
      category: faker.helpers.arrayElement(Object.keys(productCategories)),
      business: faker.helpers.arrayElement(["", ...Object.keys(businesses)]),
      countryDyeing: faker.helpers.arrayElement(Object.keys(countries)),
      countryFabric: faker.helpers.arrayElement(Object.keys(countries)),
      countryMaking: faker.helpers.arrayElement(Object.keys(countries)),
      countrySpinning: faker.helpers.arrayElement(Object.keys(countries)),
      impressionMapping: faker.helpers.arrayElement(["", ...Object.keys(impressionMapping)]),
      impressionPercentage: faker.number.float({ min: 0, max: 1 }),
      mass: faker.number.float({ min: 0.01 }),
      price: faker.number.float({ min: 1, max: 1000 }),
      airTransportRatio: faker.number.float({ min: 0, max: 1 }),
      numberOfReferences: faker.number.int({ min: 1, max: 999_999 }),
      fading: faker.datatype.boolean(),
      upcycled: faker.datatype.boolean(),
      materials: materialsShare.map((share) => {
        return {
          slug: faker.helpers.arrayElement(Object.keys(materials)),
          country: faker.helpers.arrayElement(Object.keys(countries)),
          share,
        }
      }),
      accessories: Array.from({ length: Math.floor(Math.random() * 4) }, () => {
        return {
          slug: faker.helpers.arrayElement(Object.keys(accessories)),
          quantity: faker.number.int({ min: 1, max: 5 }),
        }
      }),
    }
  })

  const csv = stringify(
    products.map((product) => [
      product.gtins.join(";"),
      product.internalReference,
      "",
      "",
      product.category,
      product.mass,
      product.upcycled ? "Oui" : "Non",
      product.numberOfReferences,
      product.price,
      product.business,
      ...Array.from({ length: 16 }).flatMap((_, i) =>
        product.materials[i]
          ? [product.materials[i].slug, `${product.materials[i].share}%`, product.materials[i].country]
          : ["", "", ""],
      ),
      product.countrySpinning,
      product.countryFabric,
      product.countryDyeing,
      product.impressionMapping,
      product.impressionMapping ? `${product.impressionPercentage * 100}%` : "",
      product.countryMaking,
      product.fading ? "Oui" : "Non",
      `${product.airTransportRatio * 100}%`,
      ...Array.from({ length: 4 }).flatMap((_, i) =>
        product.accessories[i] ? [product.accessories[i].slug, product.accessories[i].quantity] : ["", ""],
      ),
    ]),
    {
      header: true,
      columns: [
        "GTINs/EANs",
        "Référence interne",
        "Marque",
        "Score",
        "Catégorie",
        "Masse",
        "Remanufacturé",
        "Nombre de références",
        "Prix",
        "Taille de l'entreprise",
        "Matière 1",
        "Matière 1 pourcentage",
        "Matière 1 origine",
        "Matière 2",
        "Matière 2 pourcentage",
        "Matière 2 origine",
        "Matière 3",
        "Matière 3 pourcentage",
        "Matière 3 origine",
        "Matière 4",
        "Matière 4 pourcentage",
        "Matière 4 origine",
        "Matière 5",
        "Matière 5 pourcentage",
        "Matière 5 origine",
        "Matière 6",
        "Matière 6 pourcentage",
        "Matière 6 origine",
        "Matière 7",
        "Matière 7 pourcentage",
        "Matière 7 origine",
        "Matière 8",
        "Matière 8 pourcentage",
        "Matière 8 origine",
        "Matière 9",
        "Matière 9 pourcentage",
        "Matière 9 origine",
        "Matière 10",
        "Matière 10 pourcentage",
        "Matière 10 origine",
        "Matière 11",
        "Matière 11 pourcentage",
        "Matière 11 origine",
        "Matière 12",
        "Matière 12 pourcentage",
        "Matière 12 origine",
        "Matière 13",
        "Matière 13 pourcentage",
        "Matière 13 origine",
        "Matière 14",
        "Matière 14 pourcentage",
        "Matière 14 origine",
        "Matière 15",
        "Matière 15 pourcentage",
        "Matière 15 origine",
        "Matière 16",
        "Matière 16 pourcentage",
        "Matière 16 origine",
        "Origine de filature",
        "Origine de tissage/tricotage",
        "Origine de l'ennoblissement/impression",
        "Type d'impression",
        "Pourcentage d'impression",
        "Origine confection",
        "Délavage",
        "Part du transport aérien",
        "Accessoire 1",
        "Accessoire 1 quantité",
        "Accessoire 2",
        "Accessoire 2 quantité",
        "Accessoire 3",
        "Accessoire 3 quantité",
        "Accessoire 4",
        "Accessoire 4 quantité",
      ],
    },
  )
  fs.writeFileSync(name, csv, "utf8")
}

generate(process.argv[2], process.argv[3])
