import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getOrganizationById } from "../../../db/organization"
import OrganizationDetail from "../../../views/OrganizationDetail"
import { UserRole } from "@prisma/enums"
import { tryAndGetSession } from "../../../services/auth/redirect"

type Props = {
  params: Promise<{ organizationId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { organizationId } = await params
  const organization = await getOrganizationById(organizationId)

  if (!organization) {
    return {
      title: "Organisation - Affichage environnemental",
    }
  }

  return {
    title: `${organization.displayName} - Affichage environnemental`,
  }
}

const OrganizationPage = async ({ params }: Props) => {
  const session = await tryAndGetSession(false, true)
  const { organizationId } = await params
  const organization = await getOrganizationById(organizationId)
  if (!organization) {
    return notFound()
  }

  return (
    <>
      <StartDsfrOnHydration />
      <OrganizationDetail organization={organization} isAdmin={session?.user?.role === UserRole.ADMIN} />
    </>
  )
}

export default OrganizationPage
