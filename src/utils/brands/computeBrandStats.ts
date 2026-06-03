import { Products } from "../../db/product"

export const getLastDeclarationDate = (products: Products): Date | undefined =>
  products.length > 0
    ? products.reduce(
        (latest, product) => (product.createdAt > latest ? product.createdAt : latest),
        products[0].createdAt,
      )
    : undefined
