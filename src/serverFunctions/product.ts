"use server"
import {
  getProductWithScoreHistory,
  getProductWithScoreHistoryCount,
  getProductInformations as dbGetProductInformations,
} from "../db/product"

export const getProductHistory = async (gtin: string, page: number, pageSize: number) => {
  const [products, total] = await Promise.all([
    getProductWithScoreHistory(gtin, page, pageSize),
    getProductWithScoreHistoryCount(gtin),
  ])

  return { products, total }
}

export const getProductInformations = async (id: string) => dbGetProductInformations(id)
