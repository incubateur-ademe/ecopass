import { UserType } from "@prisma/enums"
import { ProductWithScore } from "../../db/product"

export const getDeclarant = (product: Pick<ProductWithScore, "upload">, userId: string) => {
  if (product.upload.createdBy.type === UserType.PROFESSIONNEL) {
    return product.upload.createdBy.organization?.displayName || "-"
  }

  if (product.upload.createdBy.id === userId) {
    return "Moi"
  }

  return "Citoyen"
}
