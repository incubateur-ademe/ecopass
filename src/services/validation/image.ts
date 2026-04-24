import { z } from "zod"

const gtinValidationMessage = "Le GTIN doit contenir 8 ou 13 chiffres"
const gtinRegex = /^\d{8}$|^\d{13}$/

const scoreFields = {
  type: z.literal("score"),
  score: z.coerce.number().positive(),
  masse: z.coerce.number().positive(),
}

const gtinField = {
  type: z.literal("gtin"),
  gtin: z.string().regex(gtinRegex, {
    message: gtinValidationMessage,
  }),
}

const detailFields = {
  moyenne: z.coerce.number().nonnegative(),
  min: z.coerce.number().nonnegative(),
  max: z.coerce.number().nonnegative(),
}

export const imageValidation = z.discriminatedUnion("type", [
  z.object({
    ...scoreFields,
  }),
  z.object({
    ...gtinField,
  }),
])

export const imageDetailValidation = z.discriminatedUnion("type", [
  z.object({
    ...scoreFields,
    ...detailFields,
  }),
  z.object({
    ...gtinField,
    ...detailFields,
  }),
])
