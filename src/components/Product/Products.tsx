"use server"

import {
  getOrganizationProductsByUserIdAndFilters,
  getOrganizationProductsCountByUserIdAndFilters,
  type ProductFilters,
} from "../../db/product"
import { auth } from "../../services/auth/auth"
import Alert from "@codegouvfr/react-dsfr/Alert"
import Badge from "@codegouvfr/react-dsfr/Badge"
import Image from "next/image"
import styles from "./Search/SearchResults.module.css"
import { formatDate, formatNumber } from "../../services/format"
import Table from "../Table/Table"
import ProductLink from "./ProductLink"
import { getProductCategory, getProductIcon } from "../../utils/product/category"
import { getDeclarant } from "../../utils/product/declarant"
import { confidencesLevel } from "../../utils/product/confidence"
import { ProductsPagination } from "./ProductsPagination"
import { getUser } from "../../db/user"

const Products = async ({ page, filters }: { page: number; filters: ProductFilters }) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }
  const user = await getUser(session.user.id)
  if (!user) {
    return null
  }

  const [products, productCount] = await Promise.all([
    getOrganizationProductsByUserIdAndFilters(user, page - 1, 10, filters),
    getOrganizationProductsCountByUserIdAndFilters(user, filters),
  ])

  const total = productCount.reduce((acc, { count }) => acc + count, 0)
  return (
    <>
      {products.length === 0 ? (
        <Alert severity='info' small description={<>Aucun résultat.</>} />
      ) : (
        <div data-testid='products-table'>
          <Table
            headers={[
              "Référence interne",
              "Marque",
              "Déclarant",
              "Catégorie",
              "Score",
              "Confiance",
              "Date de dépôt",
              "Détails",
            ]}
            fixed
            caption={total > 1 ? `${total} produits` : total === 1 ? "1 produit" : "Aucun produit"}
            data={products.map((product) => {
              const categorySlug = getProductCategory(product.informations)
              const icon = getProductIcon(categorySlug)
              return [
                <b key={`${product.id}-reference`}>{product.internalReference}</b>,
                product.brand?.name || "-",
                getDeclarant(product, session.user.id),
                <div className={styles.category} key={`cat-${product.id}`}>
                  {icon && <Image src={`/icons/${icon}.svg`} alt='' width={32} height={32} />}
                  {categorySlug || "Non renseignée"}
                </div>,
                <Badge severity='info' noIcon key={`score-${product.id}`}>
                  {product.score ? formatNumber(product.score) : "-"}
                </Badge>,
                <Badge severity='info' noIcon key={product.id}>
                  {confidencesLevel[product.confidenceLevel]}
                </Badge>,
                formatDate(product.createdAt),
                <ProductLink product={product} key={`btn-${product.id}`} />,
              ]
            })}
          />
          {total > 10 && <ProductsPagination count={Math.ceil(total / 10)} defaultPage={page} />}
        </div>
      )}
    </>
  )
}

export default Products
