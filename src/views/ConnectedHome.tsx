import { Suspense } from "react"
import Block from "../components/Block/Block"
import Upload from "../components/Upload/Upload"
import Uploads from "../components/Upload/Uploads"
import Products from "../components/Product/Products"

const ConnectedHome = () => {
  return (
    <>
      <Block>
        <h1>Écopass</h1>
        <Upload />
      </Block>
      <Block>
        <h2>Mes fichiers</h2>
        <Suspense>
          <Uploads />
        </Suspense>
      </Block>
      <Block>
        <h2>Mes Produits</h2>
        <Suspense>
          <Products />
        </Suspense>
      </Block>
    </>
  )
}

export default ConnectedHome
