"use client"
import Badge from "@codegouvfr/react-dsfr/Badge"
import Image from "next/image"
import Table from "../Table/Table"
import { ProductFilters, Products } from "../../db/product"
import { formatDate, formatNumber } from "../../services/format"
import styles from "./BrandProductsTable.module.css"
import Pagination from "@codegouvfr/react-dsfr/Pagination"
import ProductLink from "../Product/ProductLink"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { getProductCategory, getProductIcon } from "../../utils/product/category"
import FiltersBar from "../Product/FiltersBar"
import { Export } from "@prisma/client"
import ExportProducts from "../Product/Export/ExportProducts"
import { usePathname, useSearchParams } from "next/navigation"

const DGCCRFBrandProductsTable = ({
  products,
  brandId,
  currentPage,
  productCount,
  filters,
  brands,
  categories,
  declarants,
  exports,
}: {
  products: Products
  brandId?: string
  currentPage: number
  productCount: number
  filters: ProductFilters
  brands: { name: string; id: string }[]
  categories: string[]
  declarants: string[]
  exports: Export[]
}) => {
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(productCount / 10) || 1

  const tableRows = products.map((product) => {
    const categorySlug = getProductCategory(product.informations)
    const icon = getProductIcon(categorySlug)

    return [
      <span className={styles.productRef} key={`${product.id}-reference`}>
        {product.internalReference}
      </span>,
      <div className={styles.categoryCell} key={`${product.id}-category`}>
        {icon && <Image src={`/icons/${icon}.svg`} alt='' width={32} height={32} className={styles.categoryIcon} />}
        <span>{categorySlug || "Non renseignée"}</span>
      </div>,
      product.score !== null && product.score !== undefined ? (
        <Badge key={`${product.id}-score`} severity='info' noIcon>
          {formatNumber(product.score)}
        </Badge>
      ) : (
        ""
      ),
      product.gtins.join(", "),
      formatDate(product.createdAt),
      product.upload.createdBy.organization?.displayName || "N/A",
      <ProductLink product={product} brandId={brandId} key={`${product.id}-cta`} />,
    ]
  })

  return (
    <>
      <h2>Explorer les données produits</h2>
      <FiltersBar
        brands={brands}
        categories={categories}
        declarants={declarants}
        filters={filters}
        withBrandFilter={!brandId}
      />
      <ExportProducts filters={filters} exports={exports} admin />
      {productCount > 0 ? (
        <>
          <Table
            fixed
            caption='Liste des produits'
            headers={[
              "Référence marque",
              "Catégorie",
              "Score",
              "Code-barres",
              "Date de dernier dépôt",
              "Déclarant",
              "Détails",
            ]}
            data={tableRows}
          />
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              defaultPage={currentPage}
              getPageLinkProps={(pageNum) => {
                const params = new URLSearchParams(searchParams)
                params.set("page", pageNum.toString())
                return {
                  href: `${pathName}?${params.toString()}`,
                }
              }}
              showFirstLast
            />
          )}
        </>
      ) : (
        <Alert severity='info' small description='Aucun produit ne correspond aux critères de filtrage sélectionnés.' />
      )}
    </>
  )
}

export default DGCCRFBrandProductsTable
