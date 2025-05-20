import z from "zod"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductType } from "../../types/Product"
import { Status } from "../../../prisma/src/prisma"

const materialValidation = z.object({
  id: z.string(),
  productId: z.string(),
  slug: z.nativeEnum(MaterialType, { errorMap: () => ({ message: "Type de matière invalide" }) }),
  share: z
    .number()
    .min(0, "La part de la matière doit être superieure à 0%")
    .max(1, "La part de la matière doit être inférieure à 100%"),
  country: z.nativeEnum(Country, { errorMap: () => ({ message: "Origine de la matière invalide" }) }).optional(),
})

const accessoryValidation = z.object({
  id: z.string(),
  productId: z.string(),
  slug: z.nativeEnum(AccessoryType, { errorMap: () => ({ message: "Type d'accessoire invalide" }) }),
  quantity: z.number().min(1, "La quantité de l'accessoire doit être supérieure à 1"),
})

export const productValidation = z.object({
  id: z.string(),
  uploadId: z.string(),
  status: z.nativeEnum(Status, { errorMap: () => ({ message: "Statut invalide" }) }),
  createdAt: z.date(),
  updatedAt: z.date(),
  ean: z.string().regex(/^\d{8}$|^\d{13}$/, "L'EAN doit contenir 8 ou 13 chiffres"),
  date: z.date({ errorMap: () => ({ message: "Date de mise sur le marché invalide" }) }),
  type: z.nativeEnum(ProductType, { errorMap: () => ({ message: "Type de produit invalide" }) }),
  airTransportRatio: z
    .number()
    .min(0, "La part de transport aérien doit être supérieure à 0%")
    .max(1, "La part de transport aérien doit être inférieure à 100%")
    .optional(),
  upcycled: z.boolean().optional(),
  business: z.nativeEnum(Business, { errorMap: () => ({ message: "Taille de l'entreprise invalide" }) }).optional(),
  fading: z.boolean().optional(),
  mass: z.number().min(0.01, "La masse doit être supérieure à 0,01 kg"),
  numberOfReferences: z
    .number()
    .min(1, "Le nombre de références doit être supérieur à 1")
    .max(999999, "Le nombre de références doit être inférieur à 999 999"),
  price: z.number().min(1, "Le prix doit être supérieur à 1 €").max(1000, "Le prix doit être inférieur à 1000 €"),
  traceability: z.boolean(),
  countryDyeing: z
    .nativeEnum(Country, {
      errorMap: () => ({ message: "Origine de l'ennoblissement/impression invalide" }),
    })
    .optional(),
  countryFabric: z
    .nativeEnum(Country, { errorMap: () => ({ message: "Origine de tissage/tricotage invalide" }) })
    .optional(),
  countryMaking: z.nativeEnum(Country, { errorMap: () => ({ message: "Origine confection invalide" }) }).optional(),
  countrySpinning: z.nativeEnum(Country, { errorMap: () => ({ message: "Origine de filature invalide" }) }).optional(),
  impression: z.nativeEnum(Impression, { errorMap: () => ({ message: "Type d'impression invalide" }) }).optional(),
  impressionPercentage: z
    .number()
    .min(0, "Le pourcentage d'impression doit être supérieur à 0%")
    .max(1, "Le pourcentage d'impression doit être inférieur à 100")
    .optional(),
  materials: z.array(materialValidation).refine((materials) => {
    const totalShare = materials.reduce((acc, material) => acc + material.share, 0)
    return totalShare === 1
  }, "La somme des parts de matières doit être égale à 100%"),
  accessories: z.array(accessoryValidation),
})
