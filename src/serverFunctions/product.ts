"use server"
import { getProductWithScoreHistory, getProductWithScoreHistoryCount } from "../db/product"

export const getProductHistory = async (gtin: string, page: number, pageSize: number) => {
  const [products, total] = await Promise.all([
    getProductWithScoreHistory(gtin, page, pageSize),
    getProductWithScoreHistoryCount(gtin),
  ])

  return { products, total }
}
