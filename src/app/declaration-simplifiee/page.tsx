import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"
import SimplifiedDeclarationView from "../../views/SimplifiedDeclaration"

export const metadata: Metadata = {
  title: "Déclaration simplifiée - Affichage environnemental",
}

const SimplifiedDeclarationPage = async () => {
  await tryAndGetSession(true, false, "/login/public?next=/declaration-simplifiee")

  return (
    <>
      <StartDsfrOnHydration />
      <SimplifiedDeclarationView />
    </>
  )
}

export default SimplifiedDeclarationPage
