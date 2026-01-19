import { getOldProductWithScore, getProductWithScore, getProductByGtin } from "../../../../db/product"
import Product from "../../../../views/Product"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import EmptyProduct from "../../../../views/EmptyProduct"
import { Metadata } from "next"
import { tryAndGetSession } from "../../../../services/auth/redirect"

type Props = {
  params: Promise<{ gtin: string; version: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gtin, version } = await params
  const product = await getProductByGtin(gtin, version)

  if (!product) {
    return {
      title: "Produit - Affichage environnemental",
    }
  }

  return {
    title: `${product.internalReference} - Affichage environnemental`,
  }
}

const OldProductPage = async (props: Props) => {
  const session = await tryAndGetSession(false, false)
  const params = await props.params
  const [product, oldProduct] = await Promise.all([
    getProductWithScore(params.gtin),
    getOldProductWithScore(params.gtin, params.version),
  ])

  return (
    <>
      <StartDsfrOnHydration />
      {oldProduct ? (
        <Product
          product={oldProduct}
          gtin={params.gtin}
          isOld={!!product && product.id !== oldProduct.id}
          isPro={!!session}
        />
      ) : (
        <EmptyProduct />
      )}
    </>
  )
}

export default OldProductPage
