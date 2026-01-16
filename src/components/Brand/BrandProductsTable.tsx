import Badge from "@codegouvfr/react-dsfr/Badge"
import Button from "@codegouvfr/react-dsfr/Button"
import Image from "next/image"
import Table from "../Table/Table"
import { Products } from "../../db/product"
import { formatNumber } from "../../services/format"
import { ProductCategory } from "../../types/Product"
import { productMapping } from "../../utils/ecobalyse/mappings"
import styles from "./BrandProductsTable.module.css"
import { BATCH_CATEGORY } from "../../utils/types/productCategory"
import Pagination from "@codegouvfr/react-dsfr/Pagination"

const BrandProductsTable = ({
  products,
  brandId,
  currentPage,
  totalPages,
}: {
  products: Products
  brandId: string
  currentPage: number
  totalPages: number
}) => {
  const tableRows = products.map((product) => {
    const isBatch = product.informations.length !== 1
    const categorySlug = !isBatch ? product.informations[0].categorySlug : undefined
    const icon = categorySlug ? productMapping[categorySlug as ProductCategory] : undefined

    return [
      <span className={styles.productRef} key={`${product.id}-reference`}>
        {product.internalReference}
      </span>,
      <div className={styles.categoryCell} key={`${product.id}-category`}>
        {icon && <Image src={`/icons/${icon}.svg`} alt='' width={32} height={32} className={styles.categoryIcon} />}
        <span>{isBatch ? BATCH_CATEGORY : categorySlug || "Non renseignée"}</span>
      </div>,
      product.gtins.join(", "),
      product.score !== null && product.score !== undefined ? (
        <Badge key={`${product.id}-score`} severity='info' noIcon>
          {formatNumber(product.score)}
        </Badge>
      ) : (
        ""
      ),
      <Button
        key={`${product.id}-cta`}
        size='small'
        priority='secondary'
        linkProps={{ href: `/produits/${product.gtins[0]}` }}>
        Voir le détail
      </Button>,
    ]
  })

  return (
    <div>
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
    </div>
  )
}

export default BrandProductsTable
