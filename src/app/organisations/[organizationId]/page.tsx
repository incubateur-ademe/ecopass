import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getOrganizationById } from "../../../db/organization"
import OrganizationDetail from "../../../views/OrganizationDetail"

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

const BrandPage = async ({ params }: Props) => {
  const { organizationId } = await params
  const organization = await getOrganizationById(organizationId)
  if (!organization) {
    return notFound()
  }

  return (
    <>
      <StartDsfrOnHydration />
      <OrganizationDetail organization={organization} />
    </>
  )
}

export default BrandPage
