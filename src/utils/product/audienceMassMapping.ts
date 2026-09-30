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
  Jupe: {
    Man: 294,
    Woman: 294,
    Kid: 158,
    Baby: 73,
    Mixed: 294,
  },
  Robe: {
    Man: 354,
    Woman: 354,
    Kid: 199,
    Baby: 89,
    Mixed: 354,
  },
  "maillot-de-bain": {
    Man: 178,
    Woman: 142,
    Kid: 104,
    Baby: 44,
    Mixed: 178,
  },
  Imperméable: {
    Man: 311,
    Woman: 311,
    Kid: 246,
    Baby: 78,
    Mixed: 311,
  },
  Manteau: {
    Man: 1149,
    Woman: 1075,
    Kid: 776,
    Baby: 287,
    Mixed: 1149,
  },
  Veste: {
    Man: 766,
    Woman: 583,
    Kid: 484,
    Baby: 192,
    Mixed: 766,
  },
  Pantalon: {
    Man: 553,
    Woman: 430,
    Kid: 298,
    Baby: 138,
    Mixed: 553,
  },
  Short: {
    Man: 295,
    Woman: 273,
    Kid: 179,
    Baby: 74,
    Mixed: 295,
  },
  pull: {
    Man: 558,
    Woman: 392,
    Kid: 296,
    Baby: 139,
    Mixed: 558,
  },
  tshirt: {
    Man: 235,
    Woman: 187,
    Kid: 112,
    Baby: 59,
    Mixed: 235,
  },
}

export function getMassByAudience(category: string, audience: Audience) {
  return productMassByAudience[category]?.[audience] ?? null
}
