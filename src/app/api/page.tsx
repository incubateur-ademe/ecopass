import { getAPIKeys, getUserOrganization } from "../../db/user"
import APIKey from "../../views/APIKey"
import { tryAndGetSession } from "../../services/auth/redirect"
import { redirect } from "next/navigation"
export default async function ApiKeyPage() {
  const session = await tryAndGetSession(true, true)
  const keys = await getAPIKeys(session.user.id)

  const organization = await getUserOrganization(session.user.id)

  if (!organization) {
    return redirect("/")
  }

  return <APIKey keys={keys} />
}
