import { redirect } from "next/navigation"
import { auth } from "../../services/auth/auth"
import { getUserOrganization } from "../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Organization from "../../views/Organization"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mon organisation - Affichage environnemental",
}

const OrganizationPage = async () => {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/")
  }

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
