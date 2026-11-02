import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Admin from "../../../views/Admin"
import { computeAdminStats } from "../../../services/stats/stats"
import { tryAndGetSession } from "../../../services/auth/redirect"
import { canAccessAdminSpace } from "../../../utils/authorization/authorizations"
import { redirect } from "next/navigation"
import { getMetabaseToken } from "../../../serverFunctions/metabase"

export const metadata: Metadata = {
  title: "Admin - Affichage environnemental",
}
const AdminPage = async () => {
  const session = await tryAndGetSession(true, true)
  if (!canAccessAdminSpace(session.user.role)) {
    return redirect("/")
  }

  const stats = await computeAdminStats()
  const token = getMetabaseToken("dashboard", 4)
  return (
    <>
      <StartDsfrOnHydration />
      <Admin stats={stats} token={token} />
    </>
  )
}

export default AdminPage
