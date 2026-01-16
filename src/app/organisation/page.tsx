import { getUserOrganization } from "../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Organization from "../../views/Organization"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"

export const metadata: Metadata = {
  title: "Mon organisation - Affichage environnemental",
}

const OrganizationPage = async () => {
  console.log("[MEMORY][organisation/page][start]", process.memoryUsage())
  const session = await tryAndGetSession(true, true)
  const organization = await getUserOrganization(session.user.id)
  let result
  if (!organization) {
    result = <p>Vous ne faites parti d'aucune organisation</p>
  } else {
    result = (
      <>
        <StartDsfrOnHydration />
        <Organization organization={organization} />
      </>
    )
  }
  console.log("[MEMORY][organisation/page][end]", process.memoryUsage())
  return result
}

export default OrganizationPage
