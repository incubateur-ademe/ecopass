"use server"

import { getProductsByUserId } from "../../db/product"
import { auth } from "../../services/auth/auth"
import { formatDate, formatNumber } from "../../services/format"
import Button from "@codegouvfr/react-dsfr/Button"
import Table from "../Table/Table"

const Products = async () => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }
  const products = await getProductsByUserId(session.user.id)

  return products.length === 0 ? (
    <p>Aucun produit pour le moment</p>
  ) : (
    <Table
      caption='Mes produits'
      noCaption
      headers={["Date", "EAN", "Score", ""]}
      data={products.map((product) => [
        formatDate(product.createdAt),
        product.ean,
        formatNumber(product.score?.score),
        <Button linkProps={{ href: `/produits/${product.ean}` }} key={product.ean}>
          Voir le produit
        </Button>,
      ])}
    />
  )
}

export default Products
