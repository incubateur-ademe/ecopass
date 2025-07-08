"use server"

import { getOrganizationProductsByUserIdAndBrand } from "../../db/product"
import { auth } from "../../services/auth/auth"
import Search from "./Search"
import { Pagination } from "@codegouvfr/react-dsfr/Pagination"
import { formatDate, formatNumber } from "../../services/format"
import Table from "../Table/Table"
import Button from "@codegouvfr/react-dsfr/Button"
import styles from "./Products.module.css"
import Link from "next/link"
import DownloadScores from "./DownloadScores"

const Products = async ({ page, productsCount, brand }: { page: number; productsCount: number; brand?: string }) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const products = await getOrganizationProductsByUserIdAndBrand(session.user.id, page - 1, 10, brand)

  return products.length === 0 ? (
    <p>
      Rendez-vous sur la page{" "}
      <Link className='fr-link' href='/declarations'>
        Mes déclarations
      </Link>{" "}
      pour deposer un produit.
    </p>
  ) : (
    <>
      <DownloadScores brand={brand} />
      <Search />
      <Table
        className={styles.table}
        fixed
        caption='Mes produits'
        noCaption
        headers={["Date de dépot", "Catégorie", "Référence interne", "Score", ""]}
        data={products.map((product) => [
          formatDate(product.createdAt),
          product.category,
          product.internalReference,
          formatNumber(product.score?.score),
          <Button linkProps={{ href: `/produits/${product.gtins[0]}` }} key={product.gtins[0]}>
            Voir le produit
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
    </>
  )
}

export default Products
