import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Products from "../../views/Products"
import { PageProps } from "../../../.next/types/app/page"
import { Metadata } from "next"
import { auth } from "../../services/auth/auth"
import { getOrganizationProductsByUserId, getOrganizationProductsCountByUserIdAndBrand } from "../../db/product"

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
  const brand = params.brand ? (params.brand as string) : undefined

  const brands = await getOrganizationProductsByUserId(session.user.id)
  const productsCount = await getOrganizationProductsCountByUserIdAndBrand(session.user.id, brand)

  return (
    <>
      <StartDsfrOnHydration />
      <Products page={page} productsCount={productsCount} brands={brands} brand={brand} />
    </>
  )
}

export default ProductsPage
