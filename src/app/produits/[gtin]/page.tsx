import { getProductByGtin, getProductWithScore } from "../../../db/product"
import Product from "../../../views/Product"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import EmptyProduct from "../../../views/EmptyProduct"
import { Metadata } from "next"
import { tryAndGetSession } from "../../../services/auth/redirect"

type Props = {
  params: Promise<{ gtin: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gtin } = await params
  const product = await getProductByGtin(gtin)

  if (!product) {
    return {
      title: "Produit - Affichage environnemental",
    }
  }

  return {
    title: `${product.internalReference} - Affichage environnemental`,
  }
}

const ProductPage = async (props: Props) => {
  const session = await tryAndGetSession(false, false)
  const params = await props.params
  const product = await getProductWithScore(params.gtin)
  return (
    <>
      <StartDsfrOnHydration />
      {product ? <Product product={product} gtin={params.gtin} isPro={!!session} /> : <EmptyProduct />}
    </>
  )
}

export default ProductPage
