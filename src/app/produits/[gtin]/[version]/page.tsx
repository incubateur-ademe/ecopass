import { getOldProductWithScore, getProductWithScore } from "../../../../db/product"
import Product from "../../../../views/Product"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import EmptyProduct from "../../../../views/EmptyProduct"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Produit - Affichage environnemental",
}

type Props = {
  params: Promise<{ gtin: string; version: string }>
}

const OldProductPage = async (props: Props) => {
  const params = await props.params
  const [product, oldProduct] = await Promise.all([
    getProductWithScore(params.gtin),
    getOldProductWithScore(params.gtin, params.version),
  ])

  return (
    <>
      <StartDsfrOnHydration />
      {oldProduct ? (
        <Product product={oldProduct} gtin={params.gtin} isOld={!!product && product.id !== oldProduct.id} />
      ) : (
        <EmptyProduct />
      )}
    </>
  )
}

export default OldProductPage
