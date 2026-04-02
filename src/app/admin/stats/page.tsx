import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Admin from "../../../views/Admin"
import { computeAdminStats } from "../../../services/stats/stats"
import { tryAndGetSession } from "../../../services/auth/redirect"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/enums"

export const metadata: Metadata = {
  title: "Admin - Affichage environnemental",
}
const AdminPage = async () => {
  const session = await tryAndGetSession(true, true)
  if (session.user.role !== UserRole.ADMIN) {
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
