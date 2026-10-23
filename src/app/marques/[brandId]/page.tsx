import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { getBrandById, getBrandWithProducts } from "../../../db/brands"
import { Metadata } from "next"
import { tryAndGetSession } from "../../../services/auth/redirect"
import { canViewAsDgccrf } from "../../../utils/authorization/authorizations"
import { PageProps } from "../../../types/Next"
import { notFound } from "next/navigation"
import Block from "../../../components/Block/Block"
import BrandHeader from "../../../components/Brand/BrandHeader"
import BrandProductsTable from "../../../components/Brand/BrandProductsTable"
import DGCCRFBrandProductsTable from "../../../components/Brand/DGCCRFBrandProductsTable"
import {
  getOrganizationProductsByUserIdAndFilters,
  getOrganizationProductsCountByUserIdAndFilters,
  getOrganizationProductsPageData,
  getPublicProductsByBrandId,
} from "../../../db/product"
import { getExportsByUserId } from "../../../db/export"
import { getUser } from "../../../db/user"
import ExportsTable from "../../../components/Product/Export/ExportsTable"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandId } = await params
  const brandData = await getBrandById(brandId || "")

  if (!brandData) {
    return {
      title: "Marque - Affichage environnemental",
    }
  }

  return {
    title: `${brandData.name} - Affichage environnemental`,
  }
}

const BrandPage = async ({ params, searchParams }: PageProps) => {
  const session = await tryAndGetSession(false, false)
  const role = session?.user?.role
  const { brandId } = await params

  const searchParamsData = await searchParams
  const page = searchParamsData.page ? parseInt(searchParamsData.page as string, 10) : 1
  const search = searchParamsData.search ? (searchParamsData.search as string) : undefined
  const category = searchParamsData.category ? (searchParamsData.category as string) : undefined
  const declarant = searchParamsData.declarant ? (searchParamsData.declarant as string) : undefined
  const dateFrom = searchParamsData.dateFrom ? new Date(searchParamsData.dateFrom as string) : undefined
  const dateTo = searchParamsData.dateTo ? new Date(searchParamsData.dateTo as string) : undefined

  const filters = {
    brandId,
    category,
    declarant,
    dateFrom,
    dateTo,
    search,
  }

  const brandData = await getBrandWithProducts(brandId || "")
  if (!brandData) {
    return notFound()
  }
  const isDGCCRF = canViewAsDgccrf(role)
  const Layout = (
    <>
      <StartDsfrOnHydration />
      <Block
        type='yellow'
        breadCrumbs={{
          currentPageLabel: brandData.name,
          segments:
            isDGCCRF && brandData.organization
              ? [
                  { linkProps: { href: "/" }, label: "Accueil" },
                  {
                    linkProps: { href: `/organisations/${brandData.organization.id}` },
                    label: `Organisation - ${brandData.organization.displayName}`,
                  },
                ]
              : [
                  { linkProps: { href: "/" }, label: "Accueil" },
                  { linkProps: { href: "/marques" }, label: "Marques" },
                ],
        }}>
        <BrandHeader brand={brandData} />
      </Block>
    </>
  )
  if (session && isDGCCRF) {
    const user = await getUser(session.user.id)
    const [{ brands, categories, declarants }, exports, products, productCount] = await Promise.all([
      getOrganizationProductsPageData(session.user.id, { brandId }),
      getExportsByUserId(session.user.id, true),
      getOrganizationProductsByUserIdAndFilters(user, page - 1, 10, filters),
      getOrganizationProductsCountByUserIdAndFilters(user, filters),
    ])
    return (
      <>
        {Layout}
        <Block>
          <DGCCRFBrandProductsTable
            products={products}
            currentPage={page}
            brandId={brandData.id}
            productCount={productCount.reduce((acc, { count }) => acc + count, 0)}
            brands={brands}
            categories={categories}
            declarants={declarants}
            exports={exports}
            filters={filters}
          />
        </Block>
        {exports.length > 0 && (
          <Block>
            <h2 id='exports'>Vos exports de données</h2>
            <ExportsTable exports={exports} admin />
          </Block>
        )}
      </>
    )
  }

  const products = await getPublicProductsByBrandId(brandData.id, page)
  return (
    <>
      {Layout}
      <Block>
        <BrandProductsTable
          products={products}
          currentPage={page}
          brandId={brandData.id}
          productCount={brandData.productsByCategory.reduce((acc, { count }) => acc + count, 0)}
        />
      </Block>
    </>
  )
}

export default BrandPage
