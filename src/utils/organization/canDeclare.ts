import { OrganizationType } from "@prisma/enums"

export const organizationTypesAllowedToDeclare = [
  OrganizationType.Brand,
  OrganizationType.BrandAndDistributor,
  OrganizationType.Consultancy,
] as OrganizationType[]
