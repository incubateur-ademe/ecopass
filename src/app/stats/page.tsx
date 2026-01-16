import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Statistics from "../../views/Statistics"
import { computeStats } from "../../services/stats/stats"

export const metadata: Metadata = {
  title: "Statistiques - Affichage environnemental",
}

export default async function StatsPage() {
  console.log("[MEMORY][stats/page][start]", process.memoryUsage())
  const stats = await computeStats()
  const result = (
    <>
      <StartDsfrOnHydration />
      <Statistics stats={stats} />
    </>
  )
  console.log("[MEMORY][stats/page][end]", process.memoryUsage())
  return result
}
