import { Brand } from "@prisma/client"

export const getAuthorizedBrands = (organization: {
  brands: Pick<Brand, "id" | "active">[]
  authorizedBy: { from: { brands: Pick<Brand, "id" | "active">[] } }[]
}) =>
  [
    ...organization.brands.filter((brand) => brand.active).map(({ id }) => id),
    ...organization.authorizedBy.flatMap((authorization) =>
      authorization.from.brands.filter((brand) => brand.active).map(({ id }) => id),
    ),
  ] as [string, ...string[]]

export const shouldBrandUseNoGTIN = (
  brand?: {
    noGTIN?: boolean | null
    organization?: { noGTIN?: boolean | null } | null
  } | null,
) => {
  if (!brand) {
    return false
  }

  if (brand.noGTIN !== null && brand.noGTIN !== undefined) {
    return brand.noGTIN
  }

  return brand.organization?.noGTIN ?? false
}
