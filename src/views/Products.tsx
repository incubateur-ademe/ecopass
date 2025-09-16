import { Suspense } from "react"
import Block from "../components/Block/Block"
import Exports from "../components/Product/Exports"
import NewExport from "../components/Product/NewExport"
import Products from "../components/Product/Products"
import BrandSelection from "../components/Product/BrandSelection"

const ProductsPage = ({
  page,
  productsCount,
  brands,
  brand,
}: {
  page: number
  productsCount: number
  brands: string[]
  brand?: string
}) => {
  return (
    <>
      <Block>
        <h1>Mes produits</h1>
        {brands.length > 1 && <BrandSelection brands={brands} brand={brand} />}
        {productsCount === 0 ? (
          <p>Vous n'avez pas encore déclaré de produits.</p>
        ) : (
          <p>
            Vous avez <b>{productsCount}</b>{" "}
            {productsCount > 1 ? <span>produits déclarés</span> : <span>produit déclaré</span>}
            {brand && (
              <span>
                {" "}
                pour la marque <b>{brand}</b>
              </span>
            )}
            .
          </p>
        )}
      </Block>
      {productsCount > 0 && (
        <Block>
          <h2>Affichage environnemental</h2>
          <p>
            Pour télécharger l'affichage environnemental de vos produits, veuillez cliquer sur le bouton ci dessous.
          </p>
          <p>Note : Vos exports restent disponibles 30 jours.</p>
          <br />
          <NewExport brand={brand} />
          <Suspense>
            <Exports brand={brand} />
          </Suspense>
        </Block>
      )}
      <Block>
        <h2>Mes produits déclarés</h2>
        <Suspense>
          <Products page={page} productsCount={productsCount} brand={brand} />
        </Suspense>
      </Block>
    </>
  )
}

export default ProductsPage
