import { Metadata } from "next"
import { StartDsfrOnHydration } from "../../dsfr-bootstrap"
import Home from "../../views/Home"
import { tryAndGetSession } from "../../services/auth/redirect"
import { getUserOrganizationType } from "../../serverFunctions/user"

export const metadata: Metadata = {
  title: "Accueil professionnels - Affichage environnemental",
}

export default async function Professionnels() {
  console.log("[MEMORY][professionnels/page][start]", process.memoryUsage())
  const session = await tryAndGetSession(false, true)
  const type = session && session.user ? await getUserOrganizationType(session.user.id) : null
  const result = (
    <>
      <StartDsfrOnHydration />
      <Home connected={!!session} type={type} isPro />
    </>
  )
  console.log("[MEMORY][professionnels/page][end]", process.memoryUsage())
  return result
}
