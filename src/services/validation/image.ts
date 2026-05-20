import { z } from "zod"
import { productMapping } from "../../utils/ecobalyse/mappings"

const categorySlugs = Object.values(productMapping) as [string, ...string[]]

const gtinRegex = /^\d{8}$|^\d{13}$/

const modelSchema = z.union([
  z.object({ model: z.literal("withComparison"), category: z.enum(categorySlugs) }),
  z.object({ model: z.literal("simple").optional() }),
])

const scoreBase = z.object({
  type: z.literal("score"),
  score: z.coerce.number().positive(),
  masse: z.coerce.number().positive(),
})

const gtinBase = z.object({
  type: z.literal("gtin"),
  gtin: z.string().regex(gtinRegex, { message: "Le GTIN doit contenir 8 ou 13 chiffres" }),
})

export const imageValidation = z.union([scoreBase.and(modelSchema), gtinBase.and(modelSchema)])
