import { Brand } from "../../../prisma/src/prisma"

export const getAuthorizedBrands = (organization: {
  name: string
  brands: Pick<Brand, "name">[]
  authorizedBy: { from: { name: string; brands: Pick<Brand, "name">[] } }[]
}) =>
  [
    organization.name,
    ...organization.brands.map(({ name }) => name),
    ...organization.authorizedBy.map((authorization) => authorization.from.name),
    ...organization.authorizedBy.flatMap((authorization) => authorization.from.brands.map(({ name }) => name)),
  ] as [string, ...string[]]
