import { getUserOrganization } from "../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Organization from "../../views/MyOrganization"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"
import { redirect } from "next/navigation"
import { getOrganizationMembers } from "../../db/organization"
import { OrganizationRole } from "@prisma/enums"

export const metadata: Metadata = {
  title: "Mon organisation - Affichage environnemental",
}

const OrganizationPage = async () => {
  const session = await tryAndGetSession(true, true)
  const organization = await getUserOrganization(session.user.id)

  if (!organization) {
    return redirect("/")
  }

  const members = await getOrganizationMembers(organization.id)
  const isAdmin = members.find((user) => user.id === session.user.id)?.organizationRole === OrganizationRole.ADMIN

  return (
    <>
      <StartDsfrOnHydration />
      <Organization organization={organization} isAdmin={isAdmin} members={members} />
    </>
  )
}

export default OrganizationPage
