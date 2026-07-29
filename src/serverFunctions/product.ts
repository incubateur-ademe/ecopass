"use server"

import { getProductWithScore, getProductWithScoreHistory, getProductWithScoreHistoryCount } from "../db/product"

export const getProductHistory = async (gtin: string, page: number, pageSize: number) => {
  const [products, total] = await Promise.all([
    getProductWithScoreHistory(gtin, page, pageSize),
    getProductWithScoreHistoryCount(gtin),
  ])

  return { products, total }
}

export const isGTINAlreadyDeclared = async (gtin: string) => {
  const product = await getProductWithScore(gtin)
  return (
    product !== null &&
    product.brand &&
    product.brand.organization &&
    product.brand.organization.id === product.upload.createdBy.organization?.id
  )
}
