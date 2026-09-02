import { z } from "zod"
import { productMapping } from "../../utils/ecobalyse/mappings"

const categorySlugs = Object.values(productMapping) as [string, ...string[]]

const gtinRegex = /^\d{8}$|^\d{13}$/

const modelSchema = z.discriminatedUnion("modele", [
  z.object({ modele: z.literal("avecComparaison"), categorie: z.enum(categorySlugs).nullable().optional() }),
  z.object({ modele: z.literal("avecComparaisonSimple"), categorie: z.enum(categorySlugs).nullable().optional() }),
  z.object({ modele: z.literal("simple") }),
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

const typeSchema = z.discriminatedUnion("type", [scoreBase, gtinBase])

export const imageValidation = z.intersection(typeSchema, modelSchema).superRefine((data, ctx) => {
  const isComparisonModel = data.modele === "avecComparaison" || data.modele === "avecComparaisonSimple"

  if (data.type === "score" && isComparisonModel && !data.categorie) {
    ctx.addIssue({
      code: "custom",
      path: ["categorie"],
      message: "La catégorie est requise pour les modèles de comparaison avec un score.",
    })
  }
})
