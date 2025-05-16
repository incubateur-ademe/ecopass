import z from "zod"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductType } from "../../types/Product"
import { Status } from "../../../prisma/src/prisma"

const materialValidation = z.object({
  id: z.string(),
  productId: z.string(),
  slug: z.nativeEnum(MaterialType, { errorMap: () => ({ message: "Type de matière invalide" }) }),
  share: z
    .number()
    .min(0, "La part de la matière doit être un nombre positif")
    .max(1, "La part de la matière doit être inférieure ou égale à 1"),
  country: z.nativeEnum(Country, { errorMap: () => ({ message: "Origine de la matière invalide" }) }).optional(),
})

const accessoryValidation = z.object({
  id: z.string(),
  productId: z.string(),
  slug: z.nativeEnum(AccessoryType, { errorMap: () => ({ message: "Type d'accessoire invalide" }) }),
  quantity: z.number().positive("La quantité d'accessoire doit être un nombre positif"),
})

export const productValidation = z.object({
  id: z.string(),
  uploadId: z.string(),
  status: z.nativeEnum(Status, { errorMap: () => ({ message: "Statut invalide" }) }),
  createdAt: z.date(),
  updatedAt: z.date(),
  ean: z
    .string()
    .length(13, "L'EAN doit faire 13 caractères, et ne contenir que des chiffres")
    .regex(/^\d+$/, "L'EAN doit être un nombre"),
  type: z.nativeEnum(ProductType, { errorMap: () => ({ message: "Type de produit invalide" }) }),
  airTransportRatio: z.number().min(0).max(1),
  upcycled: z.boolean(),
  business: z.nativeEnum(Business, { errorMap: () => ({ message: "Taille de l'entreprise invalide" }) }),
  fading: z.boolean(),
  mass: z.number().positive("La masse doit être un nombre positif"),
  numberOfReferences: z.number().positive("Le nombre de références doit être un nombre positif"),
  price: z.number().positive("Le prix doit être un nombre positif").max(10000, "Le prix doit être inférieur à 10 000"),
  traceability: z.boolean(),
  countryDyeing: z.nativeEnum(Country, {
    errorMap: () => ({ message: "Origine de l'ennoblissement/impression invalide" }),
  }),
  countryFabric: z.nativeEnum(Country, { errorMap: () => ({ message: "Origine de tissage/tricotage invalide" }) }),
  countryMaking: z.nativeEnum(Country, { errorMap: () => ({ message: "Origine confection invalide" }) }),
  countrySpinning: z.nativeEnum(Country, { errorMap: () => ({ message: "Origine de filature invalide" }) }),
  impression: z.nativeEnum(Impression, { errorMap: () => ({ message: "Type d'impression invalide" }) }),
  impressionPercentage: z
    .number()
    .min(0, "Le pourcentage d'impression doit être un nombre positif")
    .max(1, "Le pourcentage d'impression doit être inférieur ou égal à 100"),
  materials: z.array(materialValidation).refine((materials) => {
    const totalShare = materials.reduce((acc, material) => acc + material.share, 0)
    return totalShare === 1
  }),
  accessories: z.array(accessoryValidation),
})
