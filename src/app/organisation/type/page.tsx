import { getUserOrganization } from "../../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { tryAndGetSession } from "../../../services/auth/redirect"
import OrganizationType from "../../../views/OrganizationType"

export const metadata: Metadata = {
  title: "Modifier mon organisation - Affichage environnemental",
}

const OrganizationTypePage = async () => {
  console.log("[MEMORY][organisation/type/page][start]", process.memoryUsage())
  const session = await tryAndGetSession(true, false)
  const organization = await getUserOrganization(session.user.id)
  let result
  if (!organization) {
    result = <p>Vous ne faites parti d'aucune organisation</p>
  } else {
    result = (
      <>
        <StartDsfrOnHydration />
        <OrganizationType organization={organization} />
      </>
    )
  }
  console.log("[MEMORY][organisation/type/page][end]", process.memoryUsage())
  return result
}

export default OrganizationTypePage
