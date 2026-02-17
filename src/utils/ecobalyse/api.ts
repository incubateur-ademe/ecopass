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
import { prismaClient } from "../../db/prismaClient"
import { Status } from "@prisma/enums"
import { ProductAPIValidation, ProductInformationAPI } from "../../services/validation/api"
import { runElmFunction } from "./elm"
import { scoreIsValid } from "../validation/score"
import { ParsedProductValidation } from "../../services/validation/product"

type EcobalyseProduct = Omit<ProductAPIValidation, "brandId" | "gtins" | "internalReference" | "declaredScore">

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

const convertProductToEcobalyse = (product: ParsedProductValidation): EcobalyseProduct => {
  const result = {
    airTransportRatio: product.airTransportRatio,
    business: product.business ? businessesMapping[product.business] : undefined,
    countryDyeing: product.countryDyeing ? countryMapping[product.countryDyeing] : undefined,
    countryFabric: product.countryFabric ? countryMapping[product.countryFabric] : undefined,
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
    trims: product.emptyTrims
      ? undefined
      : product.accessories
          .filter((accessory) => accessory.quantity > 0)
          .map((accessory) => ({
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

const lifeCycles = {
  materials: "Matières premières",
  spinning: "Filature",
  fabric: "Tissage & Tricotage",
  dyeing: "Ennoblissement",
  making: "Confection",
  usage: "Utilisation",
  endOfLife: "Fin de vie",
}

export const computeEcobalyseScore = async (product: EcobalyseProduct) => {
  const productData = {
    ...product,
    price: product.price === undefined ? undefined : Math.min(product.price, 1000),
    brandId: undefined,
    gtins: undefined,
    internalReference: undefined,
    declaredScore: undefined,
  }

  const result = await runElmFunction<EcobalyseResponse>({
    method: "POST",
    url: "/textile/simulator/detailed",
    body: removeUndefined(productData),
  })

  const lifeCycleValues: Record<keyof typeof lifeCycles | "transport", number> = {
    transport: result.transport.impacts.ecs,
    materials: 0,
    spinning: 0,
    fabric: 0,
    dyeing: 0,
    making: 0,
    usage: 0,
    endOfLife: 0,
  }

  Object.entries(lifeCycles).forEach(([key, label]) => {
    lifeCycleValues[key as keyof typeof lifeCycles] =
      result.lifeCycle.find((stage) => stage.label === label)?.impacts.ecs || 0
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

    trims:
      result.impacts.ecs * result.durability - Object.values(lifeCycleValues).reduce((acc, value) => acc + value, 0),
    ...lifeCycleValues,
  }
}

export const saveEcobalyseResults = async (products: ParsedProductValidation[]) =>
  Promise.all(
    products.map(async (product) => {
      try {
        const result = await computeEcobalyseScore(convertProductToEcobalyse(product))

        if (product.declaredScore && !scoreIsValid(product.declaredScore, result.score)) {
          return failProducts([
            {
              productId: product.productId,
              error: `Le score déclaré (${product.declaredScore}) ne correspond pas au score calculé (${result.score})`,
            },
          ])
        }
        await createProductScore(result, product)

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

const reparationCosts: Record<string, number> = {
  chemise: 15,
  jean: 20,
  jupe: 15,
  manteau: 40,
  pantalon: 20,
  pull: 20,
  tshirt: 10,
  chaussettes: 4,
  calecon: 4,
  slip: 4,
  "maillot-de-bain": 15,
}
export const computeBatchInformations = (
  price: number | undefined,
  numberOfReferences: number | undefined,
  products: ProductInformationAPI[],
) => {
  const allProducts = products.flatMap((produit) =>
    produit.numberOfItem === undefined ? produit : Array.from({ length: produit.numberOfItem }).map(() => produit),
  )
  if (price === undefined) {
    return allProducts.map((product) => ({
      ...product,
      numberOfReferences,
    }))
  }

  const ratios = allProducts.map((p) => {
    const ratio = reparationCosts[p.product] ?? 1
    return ratio
  })

  const totalRatio = ratios.reduce((acc, value) => acc + value, 0)
  const productsPrice = ratios.map((ratio) => (ratio / totalRatio) * price)

  return allProducts.map((product, i) => ({ ...product, price: productsPrice[i], numberOfReferences }))
}
