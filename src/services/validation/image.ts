import { z } from "zod"

export const imageValidation = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("score"),
    score: z.coerce.number().positive(),
    masse: z.coerce.number().positive(),
  }),
  z.object({
    type: z.literal("gtin"),
    gtin: z.string().regex(/^\d{8}$|^\d{13}$/, {
      message: "Le GTIN doit contenir 8 ou 13 chiffres",
    }),
  }),
])
