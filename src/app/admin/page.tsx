import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Admin from "../../views/Admin"
import { computeAdminStats } from "../../services/stats/stats"
import { tryAndGetSession } from "../../services/auth/redirect"

export const metadata: Metadata = {
  title: "Admin - Affichage environnemental",
}
const AdminPage = async () => {
  await tryAndGetSession(true, true)

  const stats = await computeAdminStats()
  return (
    <>
      <StartDsfrOnHydration />
      <Admin stats={stats} />
    </>
  )
}

export default AdminPage
