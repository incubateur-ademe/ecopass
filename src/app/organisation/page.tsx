import { getUserOrganization } from "../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Organization from "../../views/Organization"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Mon organisation - Affichage environnemental",
}

const OrganizationPage = async () => {
  const session = await tryAndGetSession(true, true)
  const organization = await getUserOrganization(session.user.id)

  if (!organization) {
    return redirect("/logout")
  }
  return (
    <>
      <StartDsfrOnHydration />
      <Organization organization={organization} />
    </>
  )
}

export default OrganizationPage
