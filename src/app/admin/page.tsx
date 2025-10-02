import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { auth } from "../../services/auth/auth"
import { UserRole } from "../../../prisma/src/prisma"
import Admin from "../../views/Admin"
import { redirect } from "next/navigation"
import { computeAdminStats } from "../../services/stats/stats"

export const metadata: Metadata = {
  title: "Admin - Affichage environnemental",
}
const AdminPage = async () => {
  const session = await auth()
  if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
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
