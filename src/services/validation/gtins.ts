import z from "zod"
import { isValidGtin } from "../../utils/validation/gtin"

export const gtinsValidation = z
  .array(
    z
      .string()
      .regex(/^\d{8}$|^\d{13}$/, "Le code GTIN doit contenir 8 ou 13 chiffres")
      .refine(isValidGtin, "Le code GTIN n'est pas valide (somme de contrôle incorrecte)"),
    {
      message: "Il doit y avoir au moins un GTIN",
    },
  )
  .min(1, "Il doit y avoir au moins un GTIN")
