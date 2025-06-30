import { redirect } from "next/navigation"
import { auth } from "../../services/auth/auth"
import { getUserBrand } from "../../db/user"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Organization from "../../views/Organization"

const OrganizationPage = async () => {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/login")
  }

  const brand = await getUserBrand(session.user.id)
  if (!brand) {
    return <p>Vous ne faites parti d'aucune organisation</p>
  }
  return (
    <>
      <StartDsfrOnHydration />
      <Organization brand={brand} />
    </>
  )
}

export default OrganizationPage
