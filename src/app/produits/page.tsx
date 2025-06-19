import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Products from "../../views/Products"
import { PageProps } from "../../../.next/types/app/page"
import { Metadata } from "next"
import { auth } from "../../services/auth/auth"
import { getProductsCountByUserId } from "../../db/product"

export const metadata: Metadata = {
  title: "Mes produits - Affichage environnemental",
}

const ProductsPage = async ({ searchParams }: PageProps) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const params = await searchParams
  const page = params.page ? parseInt(params.page as string, 10) : 1

  const productsCount = await getProductsCountByUserId(session.user.id)
  return (
    <>
      <StartDsfrOnHydration />
      <Products page={page} productsCount={productsCount} />
    </>
  )
}

export default ProductsPage
