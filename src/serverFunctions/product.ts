"use server"
import { getProductWithScoreHistory, getProductWithScoreHistoryCount } from "../db/product"

export const getProductHistory = async (gtin: string, page: number, pageSize: number) => {
  console.log(`[getProductHistory] Starting - gtin: ${gtin}, page: ${page}, pageSize: ${pageSize}`)
  const [products, total] = await Promise.all([
    getProductWithScoreHistory(gtin, page, pageSize),
    getProductWithScoreHistoryCount(gtin),
  ])

  console.log(`[getProductHistory] Completed - gtin: ${gtin}, total: ${total}`)
  return { products, total }
}
