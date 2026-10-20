import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Products from "../../views/Products"
import { PageProps } from "../../types/Next"
import { Metadata } from "next"
import { getOrganizationProductsPageData } from "../../db/product"
import { tryAndGetSession } from "../../services/auth/redirect"
import HelpBanner from "../../components/Help/HelpBanner"
import { getUserOrganizationType } from "../../db/user"
import { getExportsByUserId } from "../../db/export"

export const metadata: Metadata = {
  title: "Mes produits - Affichage environnemental",
}

const ProductsPage = async ({ searchParams }: PageProps) => {
  const session = await tryAndGetSession(true, false)
  const organizationType = (await getUserOrganizationType(session.user.id)) || undefined

  const params = await searchParams
  const page = params.page ? parseInt(params.page as string, 10) : 1
  const search = params.search ? (params.search as string) : undefined
  const brand = params.brand ? (params.brand as string) : undefined
  const category = params.category ? (params.category as string) : undefined
  const declarant = params.declarant ? (params.declarant as string) : undefined
  const dateFrom = params.dateFrom ? new Date(params.dateFrom as string) : undefined
  const dateTo = params.dateTo ? new Date(params.dateTo as string) : undefined

  const filters = {
    brandId: brand,
    category,
    declarant,
    dateFrom,
    dateTo,
    search,
  }

  const [{ brands, productsCount, categories, declarants }, exports] = await Promise.all([
    getOrganizationProductsPageData(session.user.id),
    getExportsByUserId(session.user.id),
  ])

  return (
    <>
      <StartDsfrOnHydration />
      <Products
        page={page}
        productsCount={productsCount}
        brands={brands}
        filters={filters}
        organizationType={organizationType}
        categories={categories}
        declarants={declarants}
        exports={exports}
      />
      <HelpBanner organizationType={organizationType} />
    </>
  )
}

export default ProductsPage
