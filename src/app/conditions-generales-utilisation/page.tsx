import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import ConditionsGeneralesUtilisation from "../../views/ConditionsGeneralesUtilisation"

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation - Affichage environnemental",
}

const CGUPage = () => {
  console.log("[MEMORY][conditions-generales-utilisation/page][start]", process.memoryUsage())
  const result = (
    <>
      <StartDsfrOnHydration />
      <ConditionsGeneralesUtilisation />
    </>
  )
  console.log("[MEMORY][conditions-generales-utilisation/page][end]", process.memoryUsage())
  return result
}

export default CGUPage
