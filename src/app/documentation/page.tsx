import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Documentation from "../../views/Documentation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - Affichage environnemental",
}

const DocumentationPage = () => {
  return (
    <>
      <StartDsfrOnHydration />
      <Documentation />
    </>
  )
}

export default DocumentationPage
