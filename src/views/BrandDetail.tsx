import Block from "../components/Block/Block"
import BrandHeader from "../components/Brand/BrandHeader"
import BrandProductsTable from "../components/Brand/BrandProductsTable"
import { Products } from "../db/product"
import { BrandInformation } from "../db/brands"
import { BreadcrumbProps } from "@codegouvfr/react-dsfr/Breadcrumb"
import DGCCRFBrandProductsTable from "../components/Brand/DGCCRFBrandProductsTable"

const BrandDetail = ({
  brand,
  products,
  filterCount,
  currentPage,
  breadCrumbs,
  isDGCCRF,
  filter,
}: {
  brand: BrandInformation
  products: Products
  filterCount: number
  currentPage: number
  breadCrumbs?: BreadcrumbProps
  isDGCCRF: boolean
  filter: {
    category?: string
    organization?: string
    from?: string
    to?: string
  }
}) => {
  const totalProducts = brand.productsByCategory.reduce((acc, current) => acc + current.count, 0)
  return (
    <>
      <Block type='yellow' breadCrumbs={breadCrumbs}>
        <BrandHeader brand={brand} productCount={totalProducts} />
      </Block>

      {totalProducts > 0 && (
        <Block>
          {isDGCCRF ? (
            <DGCCRFBrandProductsTable
              organizations={
                brand.organization
                  ? [
                      {
                        key: brand.organization.id,
                        value: brand.organization.displayName,
                      },
                      ...brand.organization.authorizedOrganizations.map((authOrg) => ({
                        key: authOrg.to.id,
                        value: authOrg.to.displayName,
                      })),
                    ]
                  : []
              }
              products={products}
              currentPage={currentPage}
              brandId={brand.id}
              productCount={filterCount}
              filter={filter}
            />
          ) : (
            <BrandProductsTable
              products={products}
              currentPage={currentPage}
              brandId={brand.id}
              productCount={filterCount}
            />
          )}
        </Block>
      )}
    </>
  )
}

export default BrandDetail
