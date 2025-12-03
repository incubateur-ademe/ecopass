import Table from "@codegouvfr/react-dsfr/Table"
import Button from "@codegouvfr/react-dsfr/Button"
import Alert from "@codegouvfr/react-dsfr/Alert"
import Pagination from "@codegouvfr/react-dsfr/Pagination"
import classNames from "classnames"
import { Products } from "../../../db/product"
import { formatDateTime } from "../../../services/format"
import { BATCH_CATEGORY, productCategories } from "../../../utils/types/productCategory"
import styles from "./SearchResults.module.css"
import { simplifyValue } from "../../../utils/parsing/parsing"

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
          headers={["Code-barres", "Référence interne", "Marque", "Catégorie", "Score", "Date de création", "Action"]}
          data={products.map((product) => [
            product.gtins.join(", "),
            product.internalReference,
            product.brand?.name || "-",
            product.informations.length === 1
              ? productCategories[simplifyValue(product.informations[0].category)] || product.informations[0].category
              : BATCH_CATEGORY,
            product.score ? Math.round(product.score) : "-",
            formatDateTime(product.createdAt),
            <Button
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
