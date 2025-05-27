"use server"

import { getProductsByUserId, getProductsCountByUserId } from "../../db/product"
import { auth } from "../../services/auth/auth"
import { formatDate, formatNumber } from "../../services/format"
import Button from "@codegouvfr/react-dsfr/Button"
import Table from "../Table/Table"
import Search from "./Search"

const Products = async () => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }
  const productsCount = await getProductsCountByUserId(session.user.id)
  const products = await getProductsByUserId(session.user.id)

  return products.length === 0 ? (
    <p>Vous n'avez pas encore déclaré de produits</p>
  ) : (
    <>
      <p className='fr-mb-4w'>Vous avez {productsCount} produits déclarés</p>
      <Search />
      <Table
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
    </>
  )
}

export default Products
