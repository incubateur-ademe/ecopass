import { Metadata } from "next"
import { StartDsfrOnHydration } from "../dsfr-bootstrap"
import Home from "../views/Home"
import { tryAndGetSession } from "../services/auth/redirect"
import { getUserOrganizationType } from "../serverFunctions/user"
import DGCCRFHome from "../views/DGCCRFHome"
import { PageProps } from "../types/Next"
import { searchOrganizationsAndBrands } from "../serverFunctions/dgccrf"
import { canAccessAdminSpace, canViewAsDgccrf } from "../utils/authorization/authorizations"

export const metadata: Metadata = {
  title: "Accueil - Affichage environnemental",
}

export default async function HomePage({ searchParams }: PageProps) {
  const session = await tryAndGetSession(false, true)
  const role = session?.user?.role
  const type = session && session.user ? await getUserOrganizationType(session.user.id) : null
  const params = await searchParams
  const organizationsAndBrands =
    canViewAsDgccrf(role) && typeof params.search === "string" && params.search
      ? await searchOrganizationsAndBrands(params.search)
      : null
  return (
    <>
      <StartDsfrOnHydration />
      {session && canViewAsDgccrf(role) ? (
        <DGCCRFHome organizationsAndBrands={organizationsAndBrands} isAdmin={canAccessAdminSpace(role)} />
      ) : (
        <Home connected={!!session} type={type} />
      )}
    </>
  )
}
