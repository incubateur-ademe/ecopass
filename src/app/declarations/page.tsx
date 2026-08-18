import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Declarations from "../../views/Declarations"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"
import { organizationTypesAllowedToDeclare } from "../../utils/organization/canDeclare"
import { PageProps } from "../../types/Next"
import { getUser } from "../../db/user"
import { OrganizationRole } from "@prisma/client"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Mes déclarations - Affichage environnemental",
}

const DeclarationsPage = async ({ searchParams }: PageProps) => {
  const session = await tryAndGetSession(true, true, "", organizationTypesAllowedToDeclare)

  const user = await getUser(session.user.id)
  if (!user) {
    redirect("/")
  }
  const params = await searchParams
  const page = params.page ? parseInt(params.page as string, 10) : 1
  return (
    <>
      <StartDsfrOnHydration />
      <Declarations page={page} canDeclare={user.organizationRole === OrganizationRole.ADMIN} />
    </>
  )
}

export default DeclarationsPage
