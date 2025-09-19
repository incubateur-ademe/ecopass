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
import { runElmFunction } from "./elm"

type EcobalyseProduct = Omit<ProductAPIValidation, "brand" | "gtins" | "internalReference" | "declaredScore">

const removeUndefined = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeUndefined(item)) as T
  }

  if (typeof obj === "object") {
    const cleaned: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value)
      }
    }

    return cleaned as T
  }

  return obj
}

const convertProductToEcobalyse = (product: ProductWithMaterialsAndAccessories): EcobalyseProduct => {
  const result = {
    airTransportRatio: product.airTransportRatio,
    business: product.business ? businessesMapping[product.business] : undefined,
    countryDyeing: countryMapping[product.countryDyeing],
    countryFabric: countryMapping[product.countryFabric],
    countryMaking: countryMapping[product.countryMaking],
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
  }

  return removeUndefined(result)
}

export const getEcobalyseCodes = async (type: "countries") => {
  const result = await runElmFunction<EcobalyseCode[]>({
    method: "GET",
    url: `/textile/${type}`,
  })
  return result
}

export const getEcobalyseIds = async (type: "materials" | "products" | "trims") => {
  const result = await runElmFunction<EcobalyseId[]>({
    method: "GET",
    url: `/textile/${type}`,
  })

  return result
}

export const computeEcobalyseScore = async (product: EcobalyseProduct) => {
  const productData = {
    ...product,
    brand: undefined,
    gtins: undefined,
    internalReference: undefined,
    declaredScore: undefined,
  }

  const result = await runElmFunction<EcobalyseResponse>({
    method: "POST",
    url: "/textile/simulator/detailed",
    body: productData,
  })

  return {
    score: result.impacts.ecs,
    durability: result.durability,
    acd: result.impacts.acd,
    cch: result.impacts.cch,
    etf: result.impacts["etf-c"],
    fru: result.impacts.fru,
    fwe: result.impacts.fwe,
    htc: result.impacts["htc-c"],
    htn: result.impacts["htn-c"],
    ior: result.impacts.ior,
    ldu: result.impacts.ldu,
    mru: result.impacts.mru,
    ozd: result.impacts.ozd,
    pco: result.impacts.pco,
    pma: result.impacts.pma,
    swe: result.impacts.swe,
    tre: result.impacts.tre,
    wtu: result.impacts.wtu,
    microfibers: result.complementsImpacts.microfibers,
    outOfEuropeEOL: result.complementsImpacts.outOfEuropeEOL,
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
          standardized: (result.score / product.mass) * 0.1,
          ...result,
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
