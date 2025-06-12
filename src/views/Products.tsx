import { Suspense } from "react"
import Block from "../components/Block/Block"
import Exports from "../components/Product/Exports"
import NewExport from "../components/Product/NewExport"
import Products from "../components/Product/Products"

const ProductsPage = ({ page, productsCount }: { page: number; productsCount: number }) => {
  return (
    <>
      <Block>
        <h1>Mes produits</h1>
        {productsCount === 0 ? (
          <p>Vous n'avez pas encore déclaré de produits</p>
        ) : (
          <p>
            Vous avez <b>{productsCount}</b>{" "}
            {productsCount > 1 ? <span>produits déclarés</span> : <span>produit déclaré</span>}
          </p>
        )}
      </Block>
      {productsCount > 0 && (
        <Block>
          <h2>Affichage environnemental</h2>
          <p>
            Pour télécharger l'affichage environnemental de vos produits, veuillez cliquer sur le bouton ci dessous.
          </p>
          <p>Note : seul vos 5 derniers export sont disponibles.</p>
          <br />
          <NewExport />
          <Suspense>
            <Exports />
          </Suspense>
        </Block>
      )}
      <Block>
        <h2>Mes produits déclarés</h2>
        <Suspense>
          <Products page={page} productsCount={productsCount} />
        </Suspense>
      </Block>
    </>
  )
}

export default ProductsPage
