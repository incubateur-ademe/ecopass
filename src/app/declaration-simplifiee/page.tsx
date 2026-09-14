import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"
import SimplifiedDeclarationView from "../../views/SimplifiedDeclaration"
import { UserType } from "@prisma/enums"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Déclaration simplifiée - Affichage environnemental",
}

const SimplifiedDeclarationPage = async () => {
  const session = await tryAndGetSession(true, false, "/login/public?next=/declaration-simplifiee")

  if (session.user.type !== UserType.CITOYEN) {
    redirect("/declarations")
  }
  return (
    <>
      <StartDsfrOnHydration />
      <SimplifiedDeclarationView />
    </>
  )
}

export default SimplifiedDeclarationPage
