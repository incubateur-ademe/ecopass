"use server"

import { ConfidenceLevel } from "@prisma/enums"
import { getLastProductsByGtins } from "../../db/product"

export enum ProductCheckResult {
  Valid,
  TooRecent,
  Unchanged,
  HigherConfidence,
}

const TOO_RECENT_THRESHOLD = 90 * 24 * 60 * 60 * 1000 // 90 days in milliseconds

export const checkOldProduct = async (gtins: string[], hash: string, confidenceLevel: ConfidenceLevel) => {
  const lastProducts = await getLastProductsByGtins(gtins)

  const higherConfidenceProduct =
    confidenceLevel === ConfidenceLevel.Low
      ? lastProducts.find((product) => product.confidenceLevel !== ConfidenceLevel.Low)
      : confidenceLevel === ConfidenceLevel.Medium
        ? lastProducts.find((product) => product.confidenceLevel === ConfidenceLevel.High)
        : false
  if (higherConfidenceProduct) {
    return { result: ProductCheckResult.HigherConfidence, lastProduct: higherConfidenceProduct }
  }

  const sameHash = lastProducts.find((p) => p.hash === hash)
  if (sameHash) {
    return { result: ProductCheckResult.Unchanged, lastProduct: sameHash }
  }

  if (process.env.FORBID_RECENT_DECLARATION === "true") {
    const now = Date.now()
    const tooRecentProduct = lastProducts.find((p) => now - new Date(p.createdAt).getTime() < TOO_RECENT_THRESHOLD)
    if (tooRecentProduct) {
      return { result: ProductCheckResult.TooRecent, lastProduct: tooRecentProduct }
    }
  }

  return { result: ProductCheckResult.Valid }
}
