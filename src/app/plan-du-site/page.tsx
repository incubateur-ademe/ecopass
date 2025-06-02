import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import PlanDuSite from "../../views/PlanDuSite"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plan du site - Affichage environnemental",
}

const PlanDuSitePage = () => {
  return (
    <>
      <StartDsfrOnHydration />
      <PlanDuSite />
    </>
  )
}

export default PlanDuSitePage
