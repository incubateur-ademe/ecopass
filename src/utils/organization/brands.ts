import { Brand } from "../../../prisma/src/prisma"

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
