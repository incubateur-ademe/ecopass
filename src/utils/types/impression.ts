import { Impression } from "../../types/Product"

export const impressions: Record<string, Impression> = {
  pigmentaire: Impression.Pigmentaire,
  pigmentary: Impression.Pigmentaire,
  pigment: Impression.Pigmentaire,

  fixelave: Impression.FixéLavé,
  fixedwashed: Impression.FixéLavé,
  substantive: Impression.FixéLavé,
}
