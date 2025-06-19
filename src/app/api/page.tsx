import { redirect } from "next/navigation"
import { auth } from "../../services/auth/auth"
import { getAPIKeys } from "../../db/user"
import APIKey from "../../views/APIKey"

export default async function ApiKeyPage() {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/")
  }

  const keys = await getAPIKeys(session.user.id)

  return <APIKey keys={keys} />
}
