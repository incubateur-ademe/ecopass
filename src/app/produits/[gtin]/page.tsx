import { getProductWithScore } from "../../../db/product"
import Product from "../../../views/Product"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import EmptyProduct from "../../../views/EmptyProduct"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Produit - Affichage environnemental",
}

type Props = {
  params: Promise<{ gtin: string }>
}

const ProductPage = async (props: Props) => {
  const params = await props.params
  const product = await getProductWithScore(params.gtin)

  return (
    <>
      <StartDsfrOnHydration />
      {product ? <Product product={product} gtin={params.gtin} /> : <EmptyProduct />}
    </>
  )
}

export default ProductPage
