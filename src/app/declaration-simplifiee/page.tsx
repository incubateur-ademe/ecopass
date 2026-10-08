import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { tryAndGetSession } from "../../services/auth/redirect"
import SimplifiedDeclarationView from "../../views/SimplifiedDeclaration"
import { UserType } from "@prisma/enums"
import { redirect } from "next/navigation"
import { PageProps } from "../../types/Next"

export const metadata: Metadata = {
  title: "Déclaration simplifiée - Affichage environnemental",
}

const SimplifiedDeclarationPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const gtin = typeof params.gtin === "string" ? params.gtin : undefined
  const session = await tryAndGetSession(
    true,
    false,
    `/login?next=/declaration-simplifiee${gtin ? `?gtin=${gtin}` : ""}`,
  )

  if (session.user.type !== UserType.CITOYEN) {
    redirect("/declarations")
  }
  return (
    <>
      <StartDsfrOnHydration />
      <SimplifiedDeclarationView gtin={gtin} />
    </>
  )
}

export default SimplifiedDeclarationPage
