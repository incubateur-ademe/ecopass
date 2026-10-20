import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { tryAndGetSession } from "../../../services/auth/redirect"
import AdminData from "../../../views/AdminData"
import {
  getOrganizationProductsByUserIdAndFilters,
  getOrganizationProductsCountByUserIdAndFilters,
  getOrganizationProductsPageData,
} from "../../../db/product"
import { canAccessFullData } from "../../../utils/authorization/authorizations"
import { getExportsByUserId } from "../../../db/export"
import { PageProps } from "../../../types/Next"
import { getUser } from "../../../db/user"

export const metadata: Metadata = {
  title: "Extraction des données - Affichage environnemental",
}

const AdminDataPage = async ({ searchParams }: PageProps) => {
  const session = await tryAndGetSession(true, true)
  if (!canAccessFullData(session.user.role)) {
    return redirect("/")
  }

  const user = await getUser(session.user.id)
  if (!user) {
    return null
  }

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

  const [{ brands, categories, declarants }, exports, products, productCount] = await Promise.all([
    getOrganizationProductsPageData(session.user.id),
    getExportsByUserId(session.user.id, true),
    getOrganizationProductsByUserIdAndFilters(user, page - 1, 10, filters),
    getOrganizationProductsCountByUserIdAndFilters(user, filters),
  ])

  return (
    <>
      <StartDsfrOnHydration />
      <AdminData
        currentPage={page}
        products={products}
        productCount={productCount.reduce((acc, { count }) => acc + count, 0)}
        filters={filters}
        brands={brands}
        declarants={declarants}
        categories={categories}
        exports={exports}
      />
    </>
  )
}

export default AdminDataPage
