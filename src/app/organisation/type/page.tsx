import { getUserOrganization } from "../../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { tryAndGetSession } from "../../../services/auth/redirect"
import OrganizationType from "../../../views/OrganizationType"

export const metadata: Metadata = {
  title: "Modifier mon organisation - Affichage environnemental",
}

const OrganizationTypePage = async () => {
  const session = await tryAndGetSession(true, false)
  const organization = await getUserOrganization(session.user.id)
  if (!organization) {
    return <p>Vous ne faites parti d'aucune organisation</p>
  }

  return (
    <>
      <StartDsfrOnHydration />
      <OrganizationType organization={organization} />
    </>
  )
}

export default OrganizationTypePage
