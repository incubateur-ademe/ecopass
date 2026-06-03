import { getLastProductsByGtins } from "../../db/product"

export enum ProductCheckResult {
  Valid,
  TooRecent,
  Unchanged,
}

const TOO_RECENT_THRESHOLD = 90 * 24 * 60 * 60 * 1000 // 90 days in milliseconds

export const checkOldProduct = async (gtins: string[], hash: string) => {
  const lastProducts = await getLastProductsByGtins(gtins)

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
