import fs from "fs"
import { faker } from "@faker-js/faker"
import { stringify } from "csv-stringify/sync"
import { productTypes } from "../utils/types/productType"
import { businesses } from "../utils/types/business"
import { countries } from "../utils/types/country"
import { materials } from "../utils/types/material"
import { accessories } from "../utils/types/accessory"

const generateShares = () => {
  const n = Math.floor(Math.random() * 5) + 1
  const randomNumbers = Array.from({ length: n }, () => Math.random())
  const sum = randomNumbers.reduce((acc, num) => acc + num, 0)
  return randomNumbers.map((num) => num / sum)
}

const generate = (name: string, length?: string) => {
  const numberOfRows = length ? parseInt(length) : 10000
  const products = Array.from({ length: numberOfRows }, () => {
    const materialsShare = generateShares()
    return {
      ean: `0${faker.string.numeric(12)}`,
      type: faker.helpers.arrayElement(Object.keys(productTypes)),
      business: faker.helpers.arrayElement(Object.keys(businesses)),
      countryDyeing: faker.helpers.arrayElement(Object.keys(countries)),
      countryFabric: faker.helpers.arrayElement(Object.keys(countries)),
      countryMaking: faker.helpers.arrayElement(Object.keys(countries)),
      countrySpinning: faker.helpers.arrayElement(Object.keys(countries)),
      mass: faker.number.float({ min: 0, max: 5 }),
      price: faker.number.float({ min: 1, max: 1000 }),
      airTransportRatio: faker.number.float({ min: 0, max: 1 }),
      numberOfReferences: faker.number.int({ min: 100, max: 1_000_000 }),
      fading: faker.datatype.boolean(),
      traceability: faker.datatype.boolean(),
      upcycled: faker.datatype.boolean(),
      materials: materialsShare.map((share) => {
        return {
          slug: faker.helpers.arrayElement(Object.keys(materials)),
          country: faker.helpers.arrayElement(Object.keys(countries)),
          share,
        }
      }),
      accessories: Array.from({ length: Math.floor(Math.random() * 3) }, () => {
        return {
          slug: faker.helpers.arrayElement(Object.keys(accessories)),
          quantity: faker.number.int({ min: 1, max: 5 }),
        }
      }),
    }
  })

  const csv = stringify(
    products.map((product) => [
      product.ean,
      new Date().toISOString(),
      product.type,
      product.mass,
      product.upcycled,
      product.numberOfReferences,
      product.price,
      product.business,
      product.traceability ? "Oui" : "Non",
      product.materials.map((material) => `${material.slug};${material.share * 100}%`).join(", "),
      product.materials.map((material) => `${material.slug};${material.country}`).join(", "),
      product.countrySpinning,
      product.countryFabric,
      product.countryDyeing,
      "",
      product.countryMaking,
      product.fading ? "Oui" : "Non",
      `${product.airTransportRatio * 100}%`,
      product.accessories.map((accessory) => `${accessory.slug};${accessory.quantity}`).join(", "),
    ]),
    {
      header: true,
      columns: [
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
      ],
    },
  )
  fs.writeFileSync(name, csv, "utf8")
}

generate(process.argv[2], process.argv[3])
