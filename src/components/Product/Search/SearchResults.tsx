import Button from "@codegouvfr/react-dsfr/Button"
import Alert from "@codegouvfr/react-dsfr/Alert"
import Pagination from "@codegouvfr/react-dsfr/Pagination"
import classNames from "classnames"
import { Products } from "../../../db/product"
import { BATCH_CATEGORY } from "../../../utils/types/productCategory"
import styles from "./SearchResults.module.css"
import Badge from "@codegouvfr/react-dsfr/Badge"
import Image from "next/image"
import { productMapping } from "../../../utils/ecobalyse/mappings"
import { ProductCategory } from "../../../types/Product"
import { formatNumber } from "../../../services/format"
import Table from "../../Table/Table"

const SearchResults = ({
  products,
  total,
  page,
  totalPages,
  onPageChange,
}: {
  products: Products
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  if (total === 0) {
    return <Alert severity='info' small description='Aucun produit ne correspond à vos critères de recherche.' />
  }

  return (
    <>
      <p data-testid='search-results-count'>
        <b>{total}</b> {total > 1 ? "produits trouvés" : "produit trouvé"}
      </p>
      <div data-testid='search-results-table'>
        <Table
          headers={["Code-barres", "Référence interne", "Marque", "Catégorie", "Score", "Détails"]}
          data={products.map((product) => [
            product.gtins.join(", "),
            product.internalReference,
            product.brand?.name || "-",
            <div className={styles.category} key={product.id}>
              {product.informations.length === 1 && product.informations[0].categorySlug !== null && (
                <Image
                  src={`/icons/${productMapping[product.informations[0].categorySlug as ProductCategory]}.svg`}
                  alt=''
                  width={32}
                  height={32}
                />
              )}
              {product.informations.length === 1 ? product.informations[0].categorySlug : BATCH_CATEGORY}
            </div>,
            <Badge severity='info' noIcon key={product.id}>
              {product.score ? formatNumber(product.score) : "-"}
            </Badge>,
            <Button
              priority='secondary'
              size='small'
              linkProps={{ href: `/produits/${product.gtins[0]}` }}
              key={product.id}
              className={styles.displayButton}>
              Voir le détail
            </Button>,
          ])}
        />
      </div>

      {totalPages > 1 && (
        <div className={classNames("fr-mt-4w")}>
          <Pagination
            count={totalPages}
            defaultPage={page}
            getPageLinkProps={(pageNumber) => ({
              onClick: (e) => {
                e.preventDefault()
                onPageChange(pageNumber)
              },
              href: "#",
              key: `pagination-link-${pageNumber}`,
            })}
            className={classNames("fr-mt-1w")}
          />
        </div>
      )}
    </>
  )
}

export default SearchResults
