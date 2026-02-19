import { getUserOrganization } from "../../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { tryAndGetSession } from "../../../services/auth/redirect"
import OrganizationType from "../../../views/OrganizationType"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Modifier mon organisation - Affichage environnemental",
}

const OrganizationTypePage = async () => {
  const session = await tryAndGetSession(true, false)
  const organization = await getUserOrganization(session.user.id)
  if (!organization) {
    return redirect("/logout")
  }

  return (
    <>
      <StartDsfrOnHydration />
      <OrganizationType organization={organization} />
    </>
  )
}

export default OrganizationTypePage
