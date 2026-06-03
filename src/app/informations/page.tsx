import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Informations from "../../views/Informations"

export const metadata: Metadata = {
  title: "Informations - Affichage environnemental",
}

const InformationsPage = () => {
  return (
    <>
      <StartDsfrOnHydration />
      <Informations />
    </>
  )
}

export default InformationsPage
