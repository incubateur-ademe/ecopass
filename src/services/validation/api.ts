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

const productAPIValidation = z.object({
  gtins: z.array(z.string().regex(/^\d{8}$|^\d{13}$/, "Le code GTIN doit contenir 8 ou 13 chiffres")).min(1),
  internalReference: z.string(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Date de mise sur le marché invalide")
    .transform((val) => new Date(val)),
  declaredScore: z.number().optional(),
  product: z.enum(productValues),
  airTransportRatio: z.number().min(0).max(1).optional(),
  upcycled: z.boolean().optional(),
  business: z.enum(businessValues).optional(),
  fading: z.boolean().optional(),
  mass: z.number().min(0.01),
  numberOfReferences: z.number().min(1).max(999999).optional(),
  price: z.number().min(1).max(1000).optional(),
  countryDyeing: z.enum(countryValues).optional(),
  countryFabric: z.enum(countryValues).optional(),
  countryMaking: z.enum(countryValues).optional(),
  countrySpinning: z.enum(countryValues).optional(),
  printing: z
    .object({
      kind: z.enum(printingValues),
      ratio: z.number().min(0).max(1).optional(),
    })
    .optional(),
  materials: z.array(materialValidation).refine((materials) => {
    const totalShare = materials.reduce((acc, material) => acc + material.share, 0)
    return Math.abs(totalShare - 1) < epsilon
  }, "La somme des parts de matières doit être égale à 100%"),
  trims: z.array(accessoryValidation).optional(),
})

export const getUserProductAPIValidation = (brands: [string, ...string[]]) =>
  productAPIValidation.extend({
    brand: z.enum(brands),
  })

export type ProductAPIValidation = z.infer<Return<typeof getUserProductAPIValidation>>
