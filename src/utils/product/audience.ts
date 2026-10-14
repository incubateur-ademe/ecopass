import { Audience } from "@prisma/enums"

export const audiencelabels: Record<Audience, string> = {
  Man: "Homme",
  Mixed: "Mixte",
  Woman: "Femme",
  Kid: "Enfant",
  Baby: "Bébé",
}
