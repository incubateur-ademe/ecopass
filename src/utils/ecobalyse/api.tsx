import axios from "axios"
import { EcobalyseCode, EcobalyseId, EcobalyseProduct, EcobalyseResponse } from "../../types/Ecobalyse"
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

const baseUrl = "https://ecobalyse.beta.gouv.fr/versions/v5.0.1/api"

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
  traceability: product.traceability,
  trims: product.accessories.map((accessory) => ({
    id: accessoryMapping[accessory.slug],
    quantity: accessory.quantity,
  })),
  upcycled: product.upcycled,
  product: productMapping[product.type],
})

export const getEcobalyseCodes = async (type: "countries") => {
  const result = await axios.get<EcobalyseCode[]>(`${baseUrl}/textile/${type}`)

  return result.data
}

export const getEcobalyseIds = async (type: "materials" | "products" | "trims") => {
  const result = await axios.get<EcobalyseId[]>(`${baseUrl}/textile/${type}`)

  return result.data
}

const getEcobalyseResult = async (product: ProductWithMaterialsAndAccessories) => {
  const response = await axios.post<EcobalyseResponse>(
    `${baseUrl}/textile/simulator/detailed`,
    convertProductToEcobalyse(product),
  )
  return {
    id: product.id,
    score: response.data.impacts.ecs,
    detail: [
      ...response.data.lifeCycle.map((cycle) => ({
        label: cycle.label,
        score: cycle.impacts.ecs,
      })),
      {
        label: "Transport",
        score: response.data.transport.impacts.ecs,
      },
    ],
  }
}

export const saveEcobalyseResults = async (products: ProductWithMaterialsAndAccessories[]) =>
  Promise.all(
    products.map(async (product) => {
      try {
        const result = await getEcobalyseResult(product)
        if (product.declaredScore && product.declaredScore !== result.score) {
          return failProducts([
            {
              id: product.id,
              error: `Le score déclaré (${product.declaredScore}) ne correspond pas au score calculé (${result.score})`,
            },
          ])
        }
        await createProductScore({
          productId: result.id,
          score: result.score,
          standardized: (result.score / product.mass) * 0.1,
        })

        return result
      } catch (error) {
        console.error("Error fetching Ecobalyse result:", error)
        await prismaClient.product.update({
          where: { id: product.id },
          data: { status: Status.Error },
        })
      }
    }),
  )
