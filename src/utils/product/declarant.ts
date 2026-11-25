import { UserType } from "@prisma/enums"
import { ProductWithScore } from "../../db/product"
import { displayOrganisationFullName } from "../organization/name"

export const getDeclarant = (product: Pick<ProductWithScore, "upload">, userId?: string) => {
  if (product.upload.createdBy.type === UserType.PROFESSIONNEL) {
    return product.upload.organization ? displayOrganisationFullName(product.upload.organization) : "-"
  }

  if (product.upload.createdBy.id === userId) {
    return "Moi"
  }

  return "Citoyen"
}
