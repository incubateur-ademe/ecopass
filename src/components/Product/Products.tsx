"use server"
import { getProductsByUserId } from "../../db/product"
import { auth } from "../../services/auth/auth"
import Search from "./Search"
import { Pagination } from "@codegouvfr/react-dsfr/Pagination"
import { formatDate, formatNumber } from "../../services/format"
import Table from "../Table/Table"
import Button from "@codegouvfr/react-dsfr/Button"
import styles from "./Products.module.css"

const Products = async ({ page, productsCount }: { page: number; productsCount: number }) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const products = await getProductsByUserId(session.user.id, page - 1)

  return (
    <>
      <Search />
      <Table
        className={styles.table}
        fixed
        caption='Mes produits'
        noCaption
        headers={["Date de dépot", "Catégorie", "GTIN", "Score", ""]}
        data={products.map((product) => [
          formatDate(product.createdAt),
          product.category,
          product.gtin,
          formatNumber(product.score?.score),
          <Button linkProps={{ href: `/produits/${product.gtin}` }} key={product.gtin}>
            Voir le produit
          </Button>,
        ])}
      />
      {productsCount > 10 && (
        <Pagination
          count={Math.ceil(productsCount / 10)}
          defaultPage={page}
          getPageLinkProps={(page) => ({
            href: `/produits?page=${page}`,
          })}
          showFirstLast
        />
      )}
    </>
  )
}

export default Products
