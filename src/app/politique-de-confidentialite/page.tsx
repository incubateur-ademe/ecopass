import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import PolitiqueDeConfidentialite from "../../views/PolitiqueDeConfidentialite"

export const metadata: Metadata = {
  title: "Politique de confidentialité - Affichage environnemental",
}

const PolitiqueDeConfidentialitePage = () => {
  return (
    <>
      <StartDsfrOnHydration />
      <PolitiqueDeConfidentialite />
    </>
  )
}

export default PolitiqueDeConfidentialitePage
