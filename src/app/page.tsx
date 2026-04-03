import { Metadata } from "next"
import { StartDsfrOnHydration } from "../dsfr-bootstrap"
import Home from "../views/Home"
import { tryAndGetSession } from "../services/auth/redirect"
import { getUserOrganizationType } from "../serverFunctions/user"
import { UserRole } from "@prisma/enums"
import DGCCRFHome from "../views/DGCCRFHome"
import { PageProps } from "../types/Next"
import { searchOrganizationsAndBrands } from "../serverFunctions/dgccrf"

export const metadata: Metadata = {
  title: "Accueil - Affichage environnemental",
}

export default async function HomePage({ searchParams }: PageProps) {
  const session = await tryAndGetSession(false, true)
  const type = session && session.user ? await getUserOrganizationType(session.user.id) : null
  const params = await searchParams
  const organizationsAndBrands =
    (session?.user?.role === UserRole.DGCCRF || session?.user?.role === UserRole.ADMIN) &&
    typeof params.search === "string" &&
    params.search
      ? await searchOrganizationsAndBrands(params.search)
      : null
  return (
    <>
      <StartDsfrOnHydration />
      {session && (session.user.role === UserRole.DGCCRF || session.user.role === UserRole.ADMIN) ? (
        <DGCCRFHome organizationsAndBrands={organizationsAndBrands} isAdmin={session.user.role === UserRole.ADMIN} />
      ) : (
        <Home connected={!!session} type={type} />
      )}
    </>
  )
}
