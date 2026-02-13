import { Metadata } from "next"
import { StartDsfrOnHydration } from "../dsfr-bootstrap"
import Home from "../views/Home"
import { tryAndGetSession } from "../services/auth/redirect"
import { getUserOrganizationType } from "../serverFunctions/user"
import { UserRole } from "@prisma/enums"
import DGCCRFHome from "../views/DGCCRFHome"

export const metadata: Metadata = {
  title: "Accueil - Affichage environnemental",
}

export default async function HomePage() {
  const session = await tryAndGetSession(false, true)
  const type = session && session.user ? await getUserOrganizationType(session.user.id) : null
  return (
    <>
      <StartDsfrOnHydration />
      {session && session.user.role === UserRole.DGCCRF ? <DGCCRFHome /> : <Home connected={!!session} type={type} />}
    </>
  )
}
