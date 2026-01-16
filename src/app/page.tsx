import { Metadata } from "next"
import { StartDsfrOnHydration } from "../dsfr-bootstrap"
import Home from "../views/Home"
import { tryAndGetSession } from "../services/auth/redirect"
import { getUserOrganizationType } from "../serverFunctions/user"

export const metadata: Metadata = {
  title: "Accueil - Affichage environnemental",
}

export default async function HomePage() {
  console.log("[MEMORY][home/page][start]", process.memoryUsage())
  console.log("Rendering HomePage")
  const session = await tryAndGetSession(false, true)
  const type = session && session.user ? await getUserOrganizationType(session.user.id) : null
  const result = (
    <>
      <StartDsfrOnHydration />
      <Home connected={!!session} type={type} />
    </>
  )
  console.log("[MEMORY][home/page][end]", process.memoryUsage())
  return result
}
