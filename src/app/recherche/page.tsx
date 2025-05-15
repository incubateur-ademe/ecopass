import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import RechercheView from "../../views/Recherche"

const RecherchePage = () => {
  return (
    <>
      <StartDsfrOnHydration />
      <RechercheView />
    </>
  )
}

export default RecherchePage
