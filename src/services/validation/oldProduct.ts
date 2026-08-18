"use server"

import { ConfidenceLevel, UserType } from "@prisma/enums"
import { getLastProductsByGtins } from "../../db/product"

export enum ProductCheckResult {
  Valid,
  TooRecent,
  Unchanged,
  HigherConfidence,
}

export type ProductDeclarationContext = {
  userId?: string
  userType?: UserType
  organizationId?: string | null
}

const TOO_RECENT_THRESHOLD = 90 * 24 * 60 * 60 * 1000 // 90 days in milliseconds

const isSameRecentDeclarant = (
  product: {
    confidenceLevel: ConfidenceLevel
    upload?: {
      createdBy?: { id?: string; type?: UserType; organizationId?: string | null }
      organizationId?: string | null
    } | null
  },
  currentUser?: ProductDeclarationContext,
) => {
  if (!currentUser || product.confidenceLevel === ConfidenceLevel.High) {
    return true
  }

  const productOwner = product.upload?.createdBy
  const productOrganizationId = product.upload?.organizationId ?? productOwner?.organizationId ?? null

  if (currentUser.userType === UserType.CITOYEN) {
    return productOwner?.type === UserType.CITOYEN && productOwner.id === currentUser.userId
  }

  if (currentUser.userType === UserType.PROFESSIONNEL) {
    return productOwner?.type === UserType.PROFESSIONNEL && productOrganizationId === currentUser.organizationId
  }

  return true
}

export const checkOldProduct = async (
  gtins: string[],
  hash: string,
  confidenceLevel: ConfidenceLevel,
  currentUser: ProductDeclarationContext,
) => {
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
    const tooRecentProduct = lastProducts.find(
      (product) =>
        now - new Date(product.createdAt).getTime() < TOO_RECENT_THRESHOLD &&
        isSameRecentDeclarant(product, currentUser),
    )
    if (tooRecentProduct) {
      return { result: ProductCheckResult.TooRecent, lastProduct: tooRecentProduct }
    }
  }

  return { result: ProductCheckResult.Valid }
}
