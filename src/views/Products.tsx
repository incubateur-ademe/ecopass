import { Suspense } from "react"
import Block from "../components/Block/Block"
import Products from "../components/Product/Products"
import ProductsList from "../components/Product/ProductsList"
import ExportProducts from "../components/Product/Export/ExportProducts"
import FiltersBar from "../components/Product/FiltersBar"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import Link from "next/link"
import { OrganizationType } from "@prisma/enums"
import { type ProductFilters } from "../db/product"
import { Export } from "@prisma/client"
import ExportsTable from "../components/Product/Export/ExportsTable"
import { ProductCategory } from "../types/Product"

const ProductsPage = ({
  page,
  productsCount,
  brands,
  filters,
  organizationType,
  categories,
  declarants,
  exports,
}: {
  page: number
  productsCount: { count: number; slug: ProductCategory }[]
  brands: { name: string; id: string }[]
  filters: ProductFilters
  organizationType?: OrganizationType
  categories: string[]
  declarants: string[]
  exports: Export[]
}) => {
  const total = productsCount.reduce((sum, item) => sum + item.count, 0)
  return (
    <>
      <Block type='yellow'>
        <h1>Mes produits déclarés</h1>
        {total > 0 ? (
          <>
            <p className='fr-mb-3w'>
              Vous avez {total}{" "}
              {total > 1 ? <span>références produit déclarées</span> : <span>référence produit déclarée</span>}
            </p>
            <ProductsList productsByCategory={productsCount} />
          </>
        ) : (
          <Alert
            severity='info'
            small
            description={
              <>
                Rendez-vous sur la page{" "}
                <Link className='fr-link' href={organizationType ? "/declarations" : "/declaration-simplifiee"}>
                  {organizationType ? "Mes déclarations" : "Déclaration simplifiée"}
                </Link>{" "}
                pour enregistrer un produit.
              </>
            }
          />
        )}
      </Block>
      {total > 0 && (
        <Block>
          <FiltersBar brands={brands} categories={categories} declarants={declarants} filters={filters} />
          <ExportProducts filters={filters} exports={exports} />
          <Suspense>
            <Products page={page} filters={filters} />
          </Suspense>
        </Block>
      )}
      {exports.length > 0 && (
        <Block>
          <h2 id='exports'>Vos exports de données</h2>
          <ExportsTable exports={exports} />
        </Block>
      )}
    </>
  )
}

export default ProductsPage
