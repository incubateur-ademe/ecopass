import z from "zod"
import { AccessoryType, Business, Country, Impression, MaterialType, ProductCategory } from "../../types/Product"
import { Status } from "../../../prisma/src/prisma"

const materialValidation = z.object({
  id: z.string(),
  productId: z.string(),
  slug: z.nativeEnum(MaterialType, { message: "Type de matière invalide" }),
  share: z
    .number({ message: "La part de la matière doit être un pourcentage" })
    .min(0, "La part de la matière doit être superieure à 0%")
    .max(1, "La part de la matière doit être inférieure à 100%"),
  country: z.nativeEnum(Country, { message: "Origine de la matière invalide" }).optional(),
})

const accessoryValidation = z.object({
  id: z.string(),
  productId: z.string(),
  slug: z.nativeEnum(AccessoryType, { message: "Type d'accessoire invalide" }),
  quantity: z
    .number({ message: "La quantité de l'accessoire doit être un nombre" })
    .min(1, "La quantité de l'accessoire doit être supérieure à 1"),
})

export const productValidation = z.object({
  id: z.string(),
  uploadId: z.string(),
  status: z.nativeEnum(Status, { message: "Statut invalide" }),
  createdAt: z.date(),
  updatedAt: z.date(),
  error: z.string().nullable(),
  ean: z.string().regex(/^\d{8}$|^\d{13}$/, "L'EAN doit contenir 8 ou 13 chiffres"),
  date: z.date({ message: "Date de mise sur le marché invalide" }),
  declaredScore: z.number().min(1, "Le score doit être un nombre positif").nullable(),
  category: z.nativeEnum(ProductCategory, { message: "Catégorie de produit invalide" }),
  airTransportRatio: z
    .number({ message: "La part de transport aérien doit être un pourcentage" })
    .min(0, "La part de transport aérien doit être supérieure à 0%")
    .max(1, "La part de transport aérien doit être inférieure à 100%")
    .optional(),
  upcycled: z.boolean({ message: "Remanufacturé doit valoir 'Oui' ou 'Non'" }).optional(),
  business: z.nativeEnum(Business, { message: "Taille de l'entreprise invalide" }).optional(),
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
  traceability: z.boolean({ message: "Tracabilité doit valoir 'Oui' ou 'Non'" }).optional(),
  countryDyeing: z
    .nativeEnum(Country, {
      errorMap: () => ({ message: "Origine de l'ennoblissement/impression invalide" }),
    })
    .optional(),
  countryFabric: z.nativeEnum(Country, { message: "Origine de tissage/tricotage invalide" }).optional(),
  countryMaking: z.nativeEnum(Country, { message: "Origine confection invalide" }).optional(),
  countrySpinning: z.nativeEnum(Country, { message: "Origine de filature invalide" }).optional(),
  impression: z.nativeEnum(Impression, { message: "Type d'impression invalide" }).optional(),
  impressionPercentage: z
    .number({ message: "Le pourcentage d'impression doit être un pourcentage" })
    .min(0, "Le pourcentage d'impression doit être supérieur à 0%")
    .max(1, "Le pourcentage d'impression doit être inférieur à 100%")
    .optional(),
  materials: z.array(materialValidation).refine((materials) => {
    const totalShare = materials.reduce((acc, material) => acc + material.share, 0)
    return totalShare === 1
  }, "La somme des parts de matières doit être égale à 100%"),
  accessories: z.array(accessoryValidation),
})
