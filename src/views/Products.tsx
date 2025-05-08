import Block from "../components/Block/Block"
import { Suspense } from "react"
import Uploads from "../components/Upload/Uploads"
import Products from "../components/Product/Products"
import Upload from "../components/Upload/Upload"

const ProductsView = () => {
  return (
    <>
      <Block>
        <h1>Mes produits</h1>
        <Upload />
      </Block>
      <Block>
        <div className='fr-grid-row fr-grid-row--center'>
          <div className='fr-col-12 fr-col-lg-6'>
            <h2>Mes fichiers</h2>
            <Suspense>
              <Uploads />
            </Suspense>
          </div>
          <div className='fr-col-12 fr-col-lg-6'>
            <h2>Mes Produits</h2>
            <Suspense>
              <Products />
            </Suspense>
          </div>
        </div>
      </Block>
    </>
  )
}

export default ProductsView
