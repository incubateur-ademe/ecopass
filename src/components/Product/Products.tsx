"use server"
import { getProductsByUserId, getProductsCountByUserId } from "../../db/product"
import { auth } from "../../services/auth/auth"
import Search from "./Search"
import { Pagination } from "@codegouvfr/react-dsfr/Pagination"
import { formatDate, formatNumber } from "../../services/format"
import Table from "../Table/Table"
import Button from "@codegouvfr/react-dsfr/Button"

const Products = async ({ page }: { page: number }) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const productsCount = await getProductsCountByUserId(session.user.id)
  const products = await getProductsByUserId(session.user.id, page - 1)

  return products.length === 0 ? (
    <p>Vous n'avez pas encore déclaré de produits</p>
  ) : (
    <>
      <p className='fr-mb-4w'>
        Vous avez <b>{productsCount}</b>{" "}
        {productsCount > 1 ? <span>produits déclarés</span> : <span>produit déclaré</span>}
      </p>
      <Search />
      <Table
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
      <Pagination
        count={Math.floor(productsCount / 10)}
        defaultPage={page}
        getPageLinkProps={(page) => ({
          href: `/produits?page=${page}`,
        })}
        showFirstLast
      />
    </>
  )
}

export default Products
