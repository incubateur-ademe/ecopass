import z from "zod"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../types/Product"
import { Status } from "../../../prisma/src/prisma"
import { PrintingRatio } from "./printing"
import { isValidGtin } from "../../utils/validation/gtin"
import { Return } from "@prisma/client/runtime/library"

const epsilon = 1e-10

const materialValidation = z.object({
  id: z.string(),
  productId: z.string(),
  slug: z.enum(MaterialType, { message: "Type de matière invalide" }),
  share: z
    .number({ message: "La part de la matière doit être un pourcentage" })
    .min(0, "La part de la matière doit être supérieure à 0%")
    .max(1, "La part de la matière doit être inférieure à 100%"),
  country: z.enum(Country, { message: "Origine de la matière invalide" }).optional(),
})

const accessoryValidation = z.object({
  id: z.string(),
  productId: z.string(),
  slug: z.enum(AccessoryType, { message: "Type d'accessoire invalide" }),
  quantity: z
    .number({ message: "La quantité de l'accessoire doit être un nombre" })
    .min(1, "La quantité de l'accessoire doit être supérieure à 1"),
})

const productValidation = z.object({
  id: z.string(),
  productId: z.string(),
  uploadId: z.string(),
  status: z.enum(Status, { message: "Statut invalide" }),
  createdAt: z.date(),
  error: z.string().nullable(),
  gtins: z
    .array(
      z
        .string()
        .regex(/^\d{8}$|^\d{13}$/, "Le code GTIN doit contenir 8 ou 13 chiffres")
        .refine(isValidGtin, "Le code GTIN n'est pas valide (somme de contrôle incorrecte)"),
      {
        message: "Il doit y avoir au moins un GTIN",
      },
    )
    .min(1, "Il doit y avoir au moins un GTIN"),
  internalReference: z.string({ message: "La référence interne est obligatoire" }),
  declaredScore: z.number().min(1, "Le score doit être un nombre positif").nullable(),
  category: z.enum(ProductCategory, { message: "Catégorie de produit invalide" }),
  airTransportRatio: z
    .number({ message: "La part de transport aérien doit être un pourcentage" })
    .min(0, "La part de transport aérien doit être supérieure à 0%")
    .max(1, "La part de transport aérien doit être inférieure à 100%")
    .optional(),
  upcycled: z.boolean({ message: "Remanufacturé doit valoir 'Oui' ou 'Non'" }).optional(),
  business: z.enum(Business, { message: "Taille de l'entreprise invalide" }).optional(),
  fading: z.boolean({ message: "Délavage doit valoir 'Oui' ou 'Non'" }).optional(),
  mass: z.number({ message: "Le poids est obligatoire" }).min(0.01, "La masse doit être supérieure à 0,01 kg"),
  numberOfReferences: z
    .number({ message: "Le nombre de références doit être un nombre" })
    .min(1, "Le nombre de références doit être supérieur à 1")
    .max(999999, "Le nombre de références doit être inférieur à 999 999")
    .optional(),
  price: z
    .number({ message: "Le prix doit être un nombre" })
    .min(1, "Le prix doit être supérieur à 1 €")
    .max(1000, "Le prix doit être inférieur à 1000 €")
    .optional(),
  countryDyeing: z.enum(Country, { message: "Origine de l'ennoblissement/impression invalide" }).optional(),
  countryFabric: z.enum(Country, { message: "Origine de tissage/tricotage invalide" }).optional(),
  countryMaking: z.enum(Country, { message: "Origine de confection invalide" }),
  countrySpinning: z.enum(Country, { message: "Origine de filature invalide" }).optional(),
  impression: z.enum(Impression, { message: "Type d'impression invalide" }).optional(),
  impressionPercentage: z
    .enum(PrintingRatio, { message: "Le pourcentage d'impression doit valoir 1%, 5%, 20%, 50% ou 80%" })
    .optional(),
  materials: z.array(materialValidation).refine((materials) => {
    const totalShare = materials.reduce((acc, material) => acc + material.share, 0)
    return Math.abs(totalShare - 1) < epsilon
  }, "La somme des parts de matières doit être égale à 100%"),
  accessories: z.array(accessoryValidation),
})

export const getUserProductValidation = (brands: [string, ...string[]]) =>
  productValidation
    .extend({
      brand: z.enum(brands, {
        message: `Marque invalide. Voici la liste de vos marques : ${brands.map((brand) => `"${brand}"`).join(", ")}`,
      }),
    })
    .refine((product) => {
      const hasImpression = product.impression !== undefined
      const hasImpressionPercentage = product.impressionPercentage !== undefined

      if ((hasImpression && !hasImpressionPercentage) || (hasImpressionPercentage && !hasImpression)) {
        return false
      }

      return true
    }, "Si le type d'impression est spécifié, le pourcentage d'impression doit également être spécifié")
    .refine((data) => {
      if (!data.upcycled) {
        return data.countryDyeing !== undefined && data.countryFabric !== undefined
      }
      return true
    }, "L'origine de l'ennoblissement/impression et l'origine de tissage/tricotage sont requis quand le produit n'est pas remanufacturé")

export type ParsedProductValidation = z.infer<Return<typeof getUserProductValidation>>
