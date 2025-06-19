import z from "zod"
import {
  accessoryMapping,
  businessesMapping,
  countryMapping,
  impressionMapping,
  materialMapping,
  productMapping,
} from "../../utils/ecobalyse/mappings"

const epsilon = 1e-10

const productValues = Object.values(productMapping) as [string, ...string[]]
const businessValues = Object.values(businessesMapping) as [string, ...string[]]
const countryValues = Object.values(countryMapping) as [string, ...string[]]
const printingValues = Object.values(impressionMapping) as [string, ...string[]]
const accessoryValues = Object.values(accessoryMapping) as [string, ...string[]]
const materialValues = Object.values(materialMapping) as [string, ...string[]]

const materialValidation = z.object({
  id: z.enum(materialValues, { message: "Type de matière invalide" }),
  share: z
    .number({ message: "La part de la matière doit être un pourcentage" })
    .min(0, "La part de la matière doit être supérieure à 0%")
    .max(1, "La part de la matière doit être inférieure à 100%"),
  country: z.enum(countryValues, { message: "Origine de la matière invalide" }).optional(),
})

const accessoryValidation = z.object({
  id: z.enum(accessoryValues, { message: "Type d'accessoire invalide" }),
  quantity: z
    .number({ message: "La quantité de l'accessoire doit être un nombre" })
    .min(1, "La quantité de l'accessoire doit être supérieure à 1"),
})

export const productAPIValidation = z.object({
  gtin: z.string().regex(/^\d{8}$|^\d{13}$/, "Le code GTIN doit contenir 8 ou 13 chiffres"),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Date de mise sur le marché invalide")
    .transform((val) => new Date(val)),
  brand: z.string().optional(),
  declaredScore: z.number().optional(),

  product: z.enum(productValues, { message: "Catégorie de produit invalide" }),
  airTransportRatio: z
    .number({ message: "La part de transport aérien doit être un pourcentage" })
    .min(0, "La part de transport aérien doit être supérieure à 0%")
    .max(1, "La part de transport aérien doit être inférieure à 100%")
    .optional(),
  upcycled: z.boolean({ message: "Remanufacturé doit valoir 'Oui' ou 'Non'" }).optional(),
  business: z.enum(businessValues, { message: "Taille de l'entreprise invalide" }).optional(),
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
  traceability: z.boolean({ message: "Traçabilité doit valoir 'Oui' ou 'Non'" }).optional(),
  countryDyeing: z
    .enum(countryValues, {
      errorMap: () => ({ message: "Origine de l'ennoblissement/impression invalide" }),
    })
    .optional(),
  countryFabric: z.enum(countryValues, { message: "Origine de tissage/tricotage invalide" }).optional(),
  countryMaking: z.enum(countryValues, { message: "Origine confection invalide" }).optional(),
  countrySpinning: z.enum(countryValues, { message: "Origine de filature invalide" }).optional(),
  printing: z
    .object({
      kind: z.enum(printingValues, { message: "Type d'impression invalide" }),
      ratio: z
        .number({ message: "Le pourcentage d'impression doit être un pourcentage" })
        .min(0, "Le pourcentage d'impression doit être supérieur à 0%")
        .max(1, "Le pourcentage d'impression doit être inférieur à 100%")
        .optional(),
    })
    .optional(),
  materials: z.array(materialValidation).refine((materials) => {
    const totalShare = materials.reduce((acc, material) => acc + material.share, 0)
    return Math.abs(totalShare - 1) < epsilon
  }, "La somme des parts de matières doit être égale à 100%"),
  trims: z.array(accessoryValidation).optional(),
})

export type ProductAPIValidation = z.infer<typeof productAPIValidation>
