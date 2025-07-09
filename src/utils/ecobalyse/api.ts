import axios from "axios"
import { EcobalyseCode, EcobalyseId, EcobalyseResponse } from "../../types/Ecobalyse"
import {
  accessoryMapping,
  businessesMapping,
  countryMapping,
  impressionMapping,
  materialMapping,
  productMapping,
} from "./mappings"
import { createProductScore, failProducts } from "../../db/product"
import { ProductWithMaterialsAndAccessories } from "../../types/Product"
import { prismaClient } from "../../db/prismaClient"
import { Status } from "../../../prisma/src/prisma"
import { ProductAPIValidation } from "../../services/validation/api"

type EcobalyseProduct = Omit<ProductAPIValidation, "brand" | "gtins" | "internalReference" | "date" | "declaredScore">

let baseUrl = ""
const getBaseUrl = async () => {
  if (!baseUrl) {
    const version = await prismaClient.version.findFirst({
      orderBy: { createdAt: "desc" },
    })
    if (!version) {
      throw new Error("Version not found")
    }
    baseUrl = version.link
  }
  return baseUrl
}

const convertProductToEcobalyse = (product: ProductWithMaterialsAndAccessories): EcobalyseProduct => ({
  airTransportRatio: product.airTransportRatio,
  business: product.business ? businessesMapping[product.business] : undefined,
  countryDyeing: product.countryDyeing ? countryMapping[product.countryDyeing] : undefined,
  countryFabric: product.countryFabric ? countryMapping[product.countryFabric] : undefined,
  countryMaking: product.countryFabric ? countryMapping[product.countryFabric] : undefined,
  countrySpinning: product.countrySpinning ? countryMapping[product.countrySpinning] : undefined,
  printing:
    product.impression && product.impressionPercentage
      ? { kind: impressionMapping[product.impression], ratio: product.impressionPercentage }
      : undefined,
  fading: product.fading,
  mass: product.mass,
  materials: product.materials.map((material) => ({
    ...material,
    country: material.country ? countryMapping[material.country] : undefined,
    id: materialMapping[material.slug],
  })),
  numberOfReferences: product.numberOfReferences,
  price: product.price,
  trims: product.accessories.map((accessory) => ({
    id: accessoryMapping[accessory.slug],
    quantity: accessory.quantity,
  })),
  upcycled: product.upcycled,
  product: productMapping[product.category],
})

export const getEcobalyseCodes = async (type: "countries") => {
  const result = await axios.get<EcobalyseCode[]>(`${await getBaseUrl()}/textile/${type}`)

  return result.data
}

export const getEcobalyseIds = async (type: "materials" | "products" | "trims") => {
  const result = await axios.get<EcobalyseId[]>(`${await getBaseUrl()}/textile/${type}`)

  return result.data
}

export const computeEcobalyseScore = async (product: EcobalyseProduct) => {
  const response = await axios.post<EcobalyseResponse>(`${await getBaseUrl()}/textile/simulator/detailed`, {
    ...product,
    brand: undefined,
    gtins: undefined,
    internalReference: undefined,
    date: undefined,
    declaredScore: undefined,
  })
  return {
    score: response.data.impacts.ecs,
  }
}

export const saveEcobalyseResults = async (products: ProductWithMaterialsAndAccessories[]) =>
  Promise.all(
    products.map(async (product) => {
      try {
        const result = await computeEcobalyseScore(convertProductToEcobalyse(product))

        if (product.declaredScore && Math.round(product.declaredScore) !== Math.round(result.score)) {
          return failProducts([
            {
              id: product.id,
              error: `Le score déclaré (${product.declaredScore}) ne correspond pas au score calculé (${result.score})`,
            },
          ])
        }
        await createProductScore({
          productId: product.id,
          score: result.score,
          standardized: (result.score / product.mass) * 0.1,
        })

        return {
          id: product.id,
          ...result,
        }
      } catch (error) {
        console.error("Error fetching Ecobalyse result:", error)
        await prismaClient.product.update({
          where: { id: product.id },
          data: { status: Status.Error, error: error instanceof Error ? error.message : "Unknown Ecobalyse error" },
        })
      }
    }),
  )
