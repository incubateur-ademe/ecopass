import { auth } from "./auth"
import { getUserOrganizationType } from "../../db/user"
import { redirect } from "next/navigation"
import type { Session } from "next-auth"

export async function tryAndGetSession(redirectIfNoSession: true, checkOrganizationType: boolean): Promise<Session>
export async function tryAndGetSession(
  redirectIfNoSession: false,
  checkOrganizationType: boolean,
): Promise<Session | null>

export async function tryAndGetSession(redirectIfNoSession: boolean, checkOrganizationType: boolean) {
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

  return session
}
