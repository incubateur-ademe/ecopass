import { getProductByGtin, getProductWithScore } from "../../../../db/product"
import Product from "../../../../views/Product"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import EmptyProduct from "../../../../views/EmptyProduct"
import { Metadata } from "next"
import { tryAndGetSession } from "../../../../services/auth/redirect"
import { UserRole } from "@prisma/enums"

type Props = {
  params: Promise<{ gtin: string; brandId: string }>
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
      {product ? (
        <Product
          product={product}
          gtin={params.gtin}
          isPro={!!session}
          brandId={params.brandId}
          breadCrumbs={{
            currentPageLabel: product.internalReference,
            segments:
              session?.user?.role === UserRole.DGCCRF || session?.user?.role === UserRole.ADMIN
                ? [
                    { linkProps: { href: "/" }, label: "Accueil" },
                    {
                      linkProps: { href: `/organisations/${product.brand?.organization?.id}` },
                      label: `Organisation - ${product.brand?.organization?.displayName}`,
                    },
                    { linkProps: { href: `/marques/${product.brand?.id}` }, label: `Marque - ${product.brand?.name}` },
                  ]
                : [
                    { linkProps: { href: "/" }, label: "Accueil" },
                    { linkProps: { href: `/marques/${product.brand?.id}` }, label: `Marque - ${product.brand?.name}` },
                  ],
          }}
        />
      ) : (
        <EmptyProduct />
      )}
    </>
  )
}

export default ProductPage
