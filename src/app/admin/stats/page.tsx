import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Admin from "../../../views/Admin"
import { computeAdminStats } from "../../../services/stats/stats"
import { tryAndGetSession } from "../../../services/auth/redirect"
import { redirect } from "next/navigation"
import { canAccessAdminSpace } from "../../../utils/authorization/authorizations"

export const metadata: Metadata = {
  title: "Admin - Affichage environnemental",
}
const AdminPage = async () => {
  const session = await tryAndGetSession(true, true)
  if (!canAccessAdminSpace(session.user.role)) {
    return redirect("/")
  }

  const stats = await computeAdminStats()
  return (
    <>
      <StartDsfrOnHydration />
      <Admin stats={stats} />
    </>
  )
}

export default AdminPage
