import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import ConditionsGeneralesUtilisation from "../../views/ConditionsGeneralesUtilisation"

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation - Affichage environnemental",
}

const CGUPage = () => {
  return (
    <>
      <StartDsfrOnHydration />
      <ConditionsGeneralesUtilisation />
    </>
  )
}

export default CGUPage
