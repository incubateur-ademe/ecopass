import { auth } from "./auth"
import { getUserOrganizationType } from "../../db/user"
import { redirect } from "next/navigation"
import type { Session } from "next-auth"
import { OrganizationType, UserType } from "@prisma/enums"

export async function tryAndGetSession(
  redirectIfNoSession: true,
  checkOrganizationType: boolean,
  redirection?: string,
  allowedOrganizationTypes?: OrganizationType[],
): Promise<Session>

export async function tryAndGetSession(
  redirectIfNoSession: false,
  checkOrganizationType: boolean,
  redirection?: string,
  allowedOrganizationTypes?: OrganizationType[],
): Promise<Session | null>

export async function tryAndGetSession(
  redirectIfNoSession: boolean,
  checkOrganizationType: boolean,
  redirection?: string,
  allowedOrganizationTypes?: OrganizationType[],
) {
  const session = await auth()
  if (redirectIfNoSession) {
    if (!session || !session.user) {
      redirect(redirection || "/")
    }
  }

  if (checkOrganizationType && session && session.user && session.user.type === UserType.PROFESSIONNEL) {
    const type = await getUserOrganizationType(session.user.id)
    if (type === null) {
      redirect(redirection || "/organisation/type")
    } else if (type === undefined) {
      redirect("/logout")
    }
  }

  if (allowedOrganizationTypes && session && session.user) {
    const type = await getUserOrganizationType(session?.user.id)

    if (!type || !allowedOrganizationTypes.includes(type)) {
      redirect(redirection || "/")
    }
  }

  return session
}
