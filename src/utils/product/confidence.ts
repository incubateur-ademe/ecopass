import { ConfidenceLevel, UserType } from "@prisma/enums"

export const getProductConfidenceLevel = (
  user: {
    type: UserType
    organization: {
      brands: { active: boolean; id: string }[]
      authorizedBy: { from: { brands: { active: boolean; id: string }[] } }[]
    } | null
  },
  brandId: string,
) => {
  if (user.type === UserType.CITOYEN || !user.organization) {
    return ConfidenceLevel.Low
  }

  const allBrands = [
    ...user.organization.brands,
    ...user.organization.authorizedBy.flatMap((organization) => organization.from.brands),
  ]
    .filter((brand) => brand.active)
    .map((brand) => brand.id)
  return allBrands.includes(brandId) ? ConfidenceLevel.High : ConfidenceLevel.Medium
}

export const confidencesLevel = {
  [ConfidenceLevel.High]: "FORT",
  [ConfidenceLevel.Medium]: "MOYEN",
  [ConfidenceLevel.Low]: "FAIBLE",
}
