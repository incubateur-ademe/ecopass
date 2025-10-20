import z from "zod"
import {
  accessoryMapping,
  businessesMapping,
  countryMapping,
  impressionMapping,
  materialMapping,
  productMapping,
} from "../../utils/ecobalyse/mappings"
import { Return } from "@prisma/client/runtime/library"
import { PrintingRatio } from "./printing"
import { isValidGtin } from "../../utils/validation/gtin"

const epsilon = 1e-10

const productValues = Object.values(productMapping) as [string, ...string[]]
const businessValues = Object.values(businessesMapping) as [string, ...string[]]
const countryValues = Object.values(countryMapping) as [string, ...string[]]
const printingValues = Object.values(impressionMapping) as [string, ...string[]]
const accessoryValues = Object.values(accessoryMapping) as [string, ...string[]]
const materialValues = Object.values(materialMapping) as [string, ...string[]]

const materialValidation = z.object({
  id: z.enum(materialValues),
  share: z.number().min(0).max(1),
  country: z.enum(countryValues).optional(),
})

const accessoryValidation = z.object({
  id: z.enum(accessoryValues),
  quantity: z.number().min(1),
})

const product = z.object({
  product: z.enum(productValues),
  airTransportRatio: z.number().min(0).max(1).optional(),
  upcycled: z.boolean().optional(),
  business: z.enum(businessValues).optional(),
  fading: z.boolean().optional(),
  mass: z.number().min(0.01),
  numberOfReferences: z.number().min(1).max(999999).optional(),
  price: z.number().min(1).max(1000).optional(),
  countryDyeing: z.enum(countryValues),
  countryFabric: z.enum(countryValues),
  countryMaking: z.enum(countryValues),
  countrySpinning: z.enum(countryValues).optional(),
  printing: z
    .object({
      kind: z.enum(printingValues),
      ratio: z.enum(PrintingRatio),
    })
    .optional(),
  materials: z.array(materialValidation).refine((materials) => {
    const totalShare = materials.reduce((acc, material) => acc + material.share, 0)
    return Math.abs(totalShare - 1) < epsilon
  }, "La somme des parts de matières doit être égale à 100%"),
  trims: z.array(accessoryValidation).optional(),
})

export type ProductInformationAPI = z.infer<typeof product>

const metaData = z.object({
  gtins: z
    .array(
      z
        .string()
        .regex(/^\d{8}$|^\d{13}$/, "Le code GTIN doit contenir 8 ou 13 chiffres")
        .refine(isValidGtin, "Le code GTIN n'est pas valide (somme de contrôle incorrecte)"),
    )
    .min(1),
  internalReference: z.string(),
  declaredScore: z.number().optional(),
})

export type ProductMetadataAPI = z.infer<typeof metaData> & { brand: string }

const productAPIValidation = z.object({
  ...metaData.shape,
  ...product.shape,
})

export const getUserProductAPIValidation = (brands: [string, ...string[]]) =>
  productAPIValidation.extend({
    brand: z.enum(brands),
  })

export type ProductAPIValidation = z.infer<Return<typeof getUserProductAPIValidation>>

const productsAPIValidation = z.object({
  ...metaData.shape,
  products: z.array(product).min(2, { message: "Il faut au moins 2 produits dans le lot." }),
})

export const getUserProductsAPIValidation = (brands: [string, ...string[]]) =>
  productsAPIValidation.extend({
    brand: z.enum(brands),
  })

export type ProductsAPIValidation = z.infer<Return<typeof getUserProductsAPIValidation>>

export const paginationValidation = z.object({
  page: z.number().min(0),
  size: z.number().min(1).max(100),
})

export const productsListValidation = z.intersection(
  paginationValidation,
  z.object({
    brand: z.string().optional(),
  }),
)
