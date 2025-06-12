import { Metadata } from "next"
import "swagger-ui-react/swagger-ui.css"
import doc from "../../../api/doc.json"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import APIDocPage from "../../../views/APIDocPage"

export const metadata: Metadata = {
  title: "Documentation API - Affichage Environnemental",
}

function ApiDoc() {
  return (
    <>
      <StartDsfrOnHydration />
      <APIDocPage spec={doc} />
    </>
  )
}

export default ApiDoc
