import Badge from "@codegouvfr/react-dsfr/Badge"
import Image from "next/image"
import Table from "../Table/Table"
import { Products } from "../../db/product"
import { formatNumber } from "../../services/format"
import { ProductCategory } from "../../types/Product"
import { productMapping } from "../../utils/ecobalyse/mappings"
import styles from "./BrandProductsTable.module.css"
import Pagination from "@codegouvfr/react-dsfr/Pagination"
import ProductLink from "../Product/ProductLink"
import { BATCH_CATEGORY, getProductCategory } from "../../utils/product/category"

const BrandProductsTable = ({
  products,
  brandId,
  currentPage,
  productCount,
}: {
  products: Products
  brandId: string
  currentPage: number
  productCount: number
}) => {
  const totalPages = Math.ceil(productCount / 10)
  const tableRows = products.map((product) => {
    const categorySlug = getProductCategory(product.informations)
    const icon =
      categorySlug && categorySlug !== BATCH_CATEGORY ? productMapping[categorySlug as ProductCategory] : undefined

    return [
      <span className={styles.productRef} key={`${product.id}-reference`}>
        {product.internalReference}
      </span>,
      <div className={styles.categoryCell} key={`${product.id}-category`}>
        {icon && <Image src={`/icons/${icon}.svg`} alt='' width={32} height={32} className={styles.categoryIcon} />}
        <span>{categorySlug || "Non renseignée"}</span>
      </div>,
      product.gtins.join(", "),
      product.score !== null && product.score !== undefined ? (
        <Badge key={`${product.id}-score`} severity='info' noIcon>
          {formatNumber(product.score)}
        </Badge>
      ) : (
        ""
      ),
      <ProductLink product={product} brandId={brandId} key={`${product.id}-cta`} />,
    ]
  })

  return (
    <>
      <div className={styles.tableHeader} id='produits'>
        <h2>Liste complète des produits déclarés</h2>
      </div>
      <Table
        fixed
        caption='Produits de la marque'
        noCaption
        headers={["Référence marque", "Catégorie", "Code-barres", "Score", "Détails"]}
        data={tableRows}
      />
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          defaultPage={currentPage}
          getPageLinkProps={(page) => ({
            href: `/marques/${brandId}?page=${page}#produits`,
          })}
          showFirstLast
        />
      )}
    </>
  )
}

export default BrandProductsTable
