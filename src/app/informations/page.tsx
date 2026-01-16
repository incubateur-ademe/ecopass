import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Informations from "../../views/Informations"

export const metadata: Metadata = {
  title: "Informations - Affichage environnemental",
}

const InformationsPage = () => {
  console.log("[MEMORY][informations/page][start]", process.memoryUsage())
  const result = (
    <>
      <StartDsfrOnHydration />
      <Informations />
    </>
  )
  console.log("[MEMORY][informations/page][end]", process.memoryUsage())
  return result
}

export default InformationsPage
