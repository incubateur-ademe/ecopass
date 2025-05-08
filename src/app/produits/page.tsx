import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../services/auth/auth"
import { redirect } from "next/navigation"
import Products from "../../views/Products"

const ProductPage = async () => {
  const session = await auth()
  if (!session) {
    redirect("/")
  }
  return (
    <>
      <StartDsfrOnHydration />
      <Products />
    </>
  )
}

export default ProductPage
