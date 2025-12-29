import { getUserOrganization } from "../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Organization from "../../views/Organization"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"

export const metadata: Metadata = {
  title: "Mon organisation - Affichage environnemental",
}

const OrganizationPage = async () => {
  const session = await tryAndGetSession(true, true)
  const organization = await getUserOrganization(session.user.id)

  if (!organization) {
    return <p>Vous ne faites parti d'aucune organisation</p>
  }
  return (
    <>
      <StartDsfrOnHydration />
      <Organization organization={organization} />
    </>
  )
}

export default OrganizationPage
