import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import MentionsLegales from "../../views/MentionsLegales"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales - Affichage environnemental",
}

const MentionsLegalesPage = () => {
  console.log("[MEMORY][mentions-legales/page][start]", process.memoryUsage())
  const result = (
    <>
      <StartDsfrOnHydration />
      <MentionsLegales />
    </>
  )
  console.log("[MEMORY][mentions-legales/page][end]", process.memoryUsage())
  return result
}

export default MentionsLegalesPage
