import { auth } from "./auth"
import { getUserOrganizationType } from "../../db/user"
import { redirect } from "next/navigation"
import type { Session } from "next-auth"
import { OrganizationType } from "../../../prisma/src/prisma"

export async function tryAndGetSession(
  redirectIfNoSession: true,
  checkOrganizationType: boolean,
  allowedOrganizationTypes?: OrganizationType[],
): Promise<Session>
export async function tryAndGetSession(
  redirectIfNoSession: false,
  checkOrganizationType: boolean,
  allowedOrganizationTypes?: OrganizationType[],
): Promise<Session | null>

export async function tryAndGetSession(
  redirectIfNoSession: boolean,
  checkOrganizationType: boolean,
  allowedOrganizationTypes?: OrganizationType[],
) {
  const session = await auth()
  if (redirectIfNoSession) {
    if (!session || !session.user) {
      redirect("/")
    }
  }

  if (checkOrganizationType && session && session.user) {
    const type = await getUserOrganizationType(session.user.id)
    if (!type) {
      redirect("/organisation/type")
    }
  }

  if (allowedOrganizationTypes && session && session.user) {
    const type = await getUserOrganizationType(session?.user.id)

    if (!type || !allowedOrganizationTypes.includes(type)) {
      redirect("/")
    }
  }

  return session
}
