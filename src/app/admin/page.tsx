import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Admin from "../../views/Admin"
import { computeAdminStats } from "../../services/stats/stats"
import { tryAndGetSession } from "../../services/auth/redirect"

export const metadata: Metadata = {
  title: "Admin - Affichage environnemental",
}
const AdminPage = async () => {
  console.log("[MEMORY][admin/page][start]", process.memoryUsage())
  console.log("Rendering AdminPage")
  await tryAndGetSession(true, true)

  const stats = await computeAdminStats()
  const result = (
    <>
      <StartDsfrOnHydration />
      <Admin stats={stats} />
    </>
  )
  console.log("[MEMORY][admin/page][end]", process.memoryUsage())
  return result
}

export default AdminPage
