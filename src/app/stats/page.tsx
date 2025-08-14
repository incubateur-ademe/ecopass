import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Statistics from "../../views/Statistics"
import { computeStats } from "../../services/stats/stats"

export const metadata: Metadata = {
  title: "Statistiques - Affichage environnemental",
}

export default async function StatsPage() {
  const stats = await computeStats()
  return (
    <>
      <StartDsfrOnHydration />
      <Statistics stats={stats} />
    </>
  )
}
