import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Products from "../../views/Products"
import { PageProps } from "../../types/Next"
import { Metadata } from "next"
import { getOrganizationProductsByUserId, getOrganizationProductsCountByUserIdAndBrand } from "../../db/product"
import { tryAndGetSession } from "../../services/auth/redirect"
import { organizationTypesAllowedToDeclare } from "../../utils/organization/canDeclare"

export const metadata: Metadata = {
  title: "Mes produits - Affichage environnemental",
}

const ProductsPage = async ({ searchParams }: PageProps) => {
  console.log("[MEMORY][produits/page][start]", process.memoryUsage())
  const session = await tryAndGetSession(true, true, organizationTypesAllowedToDeclare)

  const params = await searchParams
  const page = params.page ? parseInt(params.page as string, 10) : 1
  const brand = params.brand ? (params.brand as string) : undefined

  const [brands, productsCount] = await Promise.all([
    getOrganizationProductsByUserId(session.user.id),
    getOrganizationProductsCountByUserIdAndBrand(session.user.id, brand),
  ])

  const result = (
    <>
      <StartDsfrOnHydration />
      <Products page={page} productsCount={productsCount} brands={brands} brand={brand} />
    </>
  )
  console.log("[MEMORY][produits/page][end]", process.memoryUsage())
  return result
}

export default ProductsPage
