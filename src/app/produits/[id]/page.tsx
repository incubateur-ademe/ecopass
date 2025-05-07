import { getProductWithScore } from "../../../db/product"
import Product from "../../../views/Product"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import EmptyProduct from "../../../views/EmptyProduct"

type Props = {
  params: Promise<{ id: string }>
}

const ProductPage = async (props: Props) => {
  const params = await props.params

  const product = await getProductWithScore(params.id)
  return (
    <>
      <StartDsfrOnHydration />
      {product ? <Product product={product} /> : <EmptyProduct />}
    </>
  )
}

export default ProductPage
