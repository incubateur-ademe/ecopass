import { Audience } from "@prisma/client"

const productMassByAudience: Record<string, Record<Audience, number>> = {
  slip: {
    Man: 203,
    Woman: 97,
    Kid: 104,
    Baby: 51,
    Mixed: 203,
  },
  calecon: {
    Man: 203,
    Woman: 97,
    Kid: 104,
    Baby: 51,
    Mixed: 203,
  },
  chaussettes: {
    Man: 203,
    Woman: 97,
    Kid: 104,
    Baby: 51,
    Mixed: 203,
  },
  chemise: {
    Man: 294,
    Woman: 188,
    Kid: 134,
    Baby: 73,
    Mixed: 294,
  },
  jean: {
    Man: 633,
    Woman: 473,
    Kid: 336,
    Baby: 158,
    Mixed: 633,
  },
  jupe: {
    Man: 0,
    Woman: 294,
    Kid: 158,
    Baby: 73,
    Mixed: 0,
  },
  "maillot-de-bain": {
    Man: 0,
    Woman: 354,
    Kid: 199,
    Baby: 89,
    Mixed: 0,
  },
  manteau: {
    Man: 178,
    Woman: 142,
    Kid: 104,
    Baby: 44,
    Mixed: 178,
  },
  pantalon: {
    Man: 311,
    Woman: 529,
    Kid: 246,
    Baby: 78,
    Mixed: 311,
  },
  pull: {
    Man: 1149,
    Woman: 1075,
    Kid: 776,
    Baby: 287,
    Mixed: 1149,
  },
  tshirt: {
    Man: 766,
    Woman: 583,
    Kid: 484,
    Baby: 192,
    Mixed: 766,
  },
}

export function getMassByAudience(category: string, audience: Audience) {
  return productMassByAudience[category]?.[audience] ?? null
}
