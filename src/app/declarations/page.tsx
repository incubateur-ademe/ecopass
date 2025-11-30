import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Declarations from "../../views/Declarations"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"
import { organizationTypesAllowedToDeclare } from "../../utils/organization/canDeclare"
import { PageProps } from "../../types/Next"

export const metadata: Metadata = {
  title: "Mes déclarations - Affichage environnemental",
}

const DeclarationsPage = async ({ searchParams }: PageProps) => {
  await tryAndGetSession(true, true, organizationTypesAllowedToDeclare)

  const params = await searchParams
  const page = params.page ? parseInt(params.page as string, 10) : 1
  return (
    <>
      <StartDsfrOnHydration />
      <Declarations page={page} />
    </>
  )
}

export default DeclarationsPage
