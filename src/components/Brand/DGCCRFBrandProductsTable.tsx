"use client"
import Badge from "@codegouvfr/react-dsfr/Badge"
import Image from "next/image"
import Table from "../Table/Table"
import { Products } from "../../db/product"
import { formatDate, formatNumber } from "../../services/format"
import styles from "./BrandProductsTable.module.css"
import Pagination from "@codegouvfr/react-dsfr/Pagination"
import ProductLink from "../Product/ProductLink"
import DGCCRFExport from "./DGCCRFExportButton"
import DGCCRFFilter from "./DGCCRFFilter"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { getProductCategory, getProductIcon } from "../../utils/product/category"

const DGCCRFBrandProductsTable = ({
  products,
  brandId,
  currentPage,
  productCount,
  filter,
  organizations,
}: {
  products: Products
  brandId: string
  currentPage: number
  productCount: number
  filter: {
    category?: string
    organization?: string
    from?: string
    to?: string
  }
  organizations: {
    key: string
    value: string
  }[]
}) => {
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
      <DGCCRFFilter filter={filter} organizations={organizations} />
      {productCount > 0 ? (
        <>
          <div className={styles.tableHeader} id='produits'>
            <h2>Liste complète des produits déclarés</h2>
          </div>
          <DGCCRFExport brandId={brandId} productCount={productCount} filter={filter} />
          <Table
            fixed
            caption='Liste des produits de la marque'
            noCaption
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
              getPageLinkProps={(page) => ({
                href: `/marques/${brandId}?page=${page}&${filter.category ? `category=${filter.category}&` : ""}${filter.organization ? `organization=${filter.organization}&` : ""}#produits`,
              })}
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
