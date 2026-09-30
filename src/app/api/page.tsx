import { getAPIKeys } from "../../db/user"
import APIKey from "../../views/APIKey"
import { tryAndGetSession } from "../../services/auth/redirect"

export default async function ApiKeyPage() {
  const session = await tryAndGetSession(true, true)
  const keys = await getAPIKeys(session.user.id)

  return <APIKey keys={keys} />
}
