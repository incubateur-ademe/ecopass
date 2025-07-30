"use server"

import { getProductWithScoreHistory, getProductWithScoreHistoryCount } from "../db/product"
import { auth } from "../services/auth/auth"

export const getProductHistory = async (gtin: string, page: number, pageSize: number) => {
  const session = await auth()
  if (!session || !session.user) {
    return { products: [], total: 0 }
  }

  const [products, total] = await Promise.all([
    getProductWithScoreHistory(gtin, page, pageSize),
    getProductWithScoreHistoryCount(gtin),
  ])

  return { products, total }
}
