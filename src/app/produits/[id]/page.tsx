import { getProductWithScore } from "../../../db/product"
import Product from "../../../views/Product"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import EmptyProduct from "../../../views/EmptyProduct"
import { auth } from "../../../services/auth/auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Produit - Affichage environnemental",
}

type Props = {
  params: Promise<{ id: string }>
}

const ProductPage = async (props: Props) => {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/")
  }
  const params = await props.params

  const product = await getProductWithScore(params.id, session.user.id)
  return (
    <>
      <StartDsfrOnHydration />
      {product ? <Product product={product} /> : <EmptyProduct />}
    </>
  )
}

export default ProductPage
