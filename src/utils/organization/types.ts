import { OrganizationType } from "@prisma/enums"

export const organizationTypes: Record<OrganizationType, string> = {
  [OrganizationType.Brand]: "Marque",
  [OrganizationType.Distributor]: "Distributeur",
  [OrganizationType.BrandAndDistributor]: "Marque et distributeur",
  [OrganizationType.Consultancy]: "Bureau d'études",
  [OrganizationType.Other]: "Autre",
}
