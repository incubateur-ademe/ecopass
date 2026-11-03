"use server"

import { getBrandsInformations } from "../../db/product"
import { canAccessAdminSpace } from "../../utils/authorization/authorizations"
import { auth } from "../auth/auth"

export const computeAdminStats = async () => {
  const session = await auth()
  if (!session || !session.user || !canAccessAdminSpace(session.user.role)) {
    return null
  }

  return getBrandsInformations()
}

export type AdminStats = NonNullable<Awaited<ReturnType<typeof computeAdminStats>>>
