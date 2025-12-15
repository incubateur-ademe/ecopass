import { Metadata } from "next"
import { StartDsfrOnHydration } from "../../dsfr-bootstrap"
import Home from "../../views/Home"
import { tryAndGetSession } from "../../services/auth/redirect"
import { getUserOrganizationType } from "../../serverFunctions/user"

export const metadata: Metadata = {
  title: "Accueil professionnels - Affichage environnemental",
}

export default async function Professionnels() {
  const session = await tryAndGetSession(false, true)
  const type = session && session.user ? await getUserOrganizationType(session.user.id) : null
  return (
    <>
      <StartDsfrOnHydration />
      <Home connected={!!session} type={type} isPro />
    </>
  )
}
