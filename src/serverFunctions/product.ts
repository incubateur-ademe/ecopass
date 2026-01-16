"use server"
import { getProductWithScoreHistory, getProductWithScoreHistoryCount } from "../db/product"

export const getProductHistory = async (gtin: string, page: number, pageSize: number) => {
  console.log("[MEMORY][serverFunctions/product/getProductHistory][start]", process.memoryUsage())
  const [products, total] = await Promise.all([
    getProductWithScoreHistory(gtin, page, pageSize),
    getProductWithScoreHistoryCount(gtin),
  ])
  const result = { products, total }
  console.log("[MEMORY][serverFunctions/product/getProductHistory][end]", process.memoryUsage())
  return result
}
