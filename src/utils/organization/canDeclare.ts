import { OrganizationType } from "../../../prisma/src/prisma"

export const organizationTypesAllowedToDeclare = [
  OrganizationType.Brand,
  OrganizationType.BrandAndDistributor,
  OrganizationType.Consultancy,
] as OrganizationType[]
