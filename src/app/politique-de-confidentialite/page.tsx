import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import PolitiqueDeConfidentialite from "../../views/PolitiqueDeConfidentialite"
import { Metadata } from "next"

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
