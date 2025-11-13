import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import MentionsLegales from "../../views/MentionsLegales"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mentions légales - Affichage environnemental",
}

const MentionsLegalesPage = () => {
  return (
    <>
      <StartDsfrOnHydration />
      <MentionsLegales />
    </>
  )
}

export default MentionsLegalesPage
