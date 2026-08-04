"use server"

import { ConfidenceLevel } from "@prisma/enums"
import { getProductWithScoreHistory, getProductWithScoreHistoryCount } from "../db/product"
import { getUser } from "../db/user"
import { auth } from "../services/auth/auth"
import { checkOldProduct, ProductCheckResult } from "../services/validation/oldProduct"
import { getProductConfidenceLevel } from "../utils/product/confidence"

export const getProductHistory = async (gtin: string, page: number, pageSize: number) => {
  const [products, total] = await Promise.all([
    getProductWithScoreHistory(gtin, page, pageSize),
    getProductWithScoreHistoryCount(gtin),
  ])

  return { products, total }
}

export const isGTINAlreadyDeclared = async (gtin: string, brandId?: string) => {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const user = await getUser(session.user.id)
  if (!user) {
    throw new Error("User not found")
  }

  const confidenceLevel = brandId ? getProductConfidenceLevel(user, brandId) : ConfidenceLevel.Low
  const { result, lastProduct } = await checkOldProduct([gtin], "", confidenceLevel)
  if (result === ProductCheckResult.HigherConfidence) {
    return lastProduct?.gtins[0]
  }

  return false
}
