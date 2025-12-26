"use server"
import { getOrganizationProductsByUserIdAndBrand } from "../../db/product"
import { auth } from "../../services/auth/auth"
import Search from "./Search"
import { Pagination } from "@codegouvfr/react-dsfr/Pagination"
import Table from "@codegouvfr/react-dsfr/Table"
import Button from "@codegouvfr/react-dsfr/Button"
import Link from "next/link"
import DownloadScores from "./DownloadScores"
import { BATCH_CATEGORY } from "../../utils/types/productCategory"
import Alert from "@codegouvfr/react-dsfr/Alert"
import Badge from "@codegouvfr/react-dsfr/Badge"
import Image from "next/image"
import { productMapping } from "../../utils/ecobalyse/mappings"
import { ProductCategory } from "../../types/Product"
import styles from "./Search/SearchResults.module.css"
import { formatDate, formatNumber } from "../../services/format"

const Products = async ({ page, productsCount, brand }: { page: number; productsCount: number; brand?: string }) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const products = await getOrganizationProductsByUserIdAndBrand(session.user.id, page - 1, 10, brand)

  return products.length === 0 ? (
    <Alert
      severity='info'
      small
      description={
        <>
          Rendez-vous sur la page{" "}
          <Link className='fr-link' href='/declarations'>
            Mes déclarations
          </Link>{" "}
          pour enregistrer un produit.
        </>
      }
    />
  ) : (
    <>
      <DownloadScores brand={brand} />
      <Search withoutHint />
      <div data-testid='products-table'>
        <Table
          headers={["Référence interne", "Catégorie", "Score", "Date de dépot", "Détails"]}
          data={products.map((product) => [
            <b key={`${product.id}-reference`}>{product.internalReference}</b>,
            <div className={styles.category} key={`cat-${product.id}`}>
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
            <Badge severity='info' noIcon key={`score-${product.id}`}>
              {product.score ? formatNumber(product.score) : "-"}
            </Badge>,
            formatDate(product.createdAt),
            <Button
              priority='secondary'
              size='small'
              iconId='fr-icon-arrow-right-line'
              linkProps={{ href: `/produits/${product.gtins[0]}` }}
              key={`btn-${product.id}`}
              className={styles.displayButton}>
              Voir le détail
            </Button>,
          ])}
        />
        {productsCount > 10 && (
          <Pagination
            count={Math.ceil(productsCount / 10)}
            defaultPage={page}
            getPageLinkProps={(page) => ({
              href: `/produits?page=${page}${brand ? `&brand=${brand}` : ""}`,
            })}
            showFirstLast
          />
        )}
      </div>
    </>
  )
}

export default Products
