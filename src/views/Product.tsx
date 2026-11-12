import { BreadcrumbProps } from "@codegouvfr/react-dsfr/Breadcrumb"
import Product from "../components/Product/Product"
import { Distribution, ProductWithScore } from "../db/product"

const ProductPage = ({
  product,
  gtin,
  isOld,
  isPro,
  brandId,
  distribution,
  breadCrumbs,
}: {
  product: ProductWithScore
  gtin: string
  isOld?: boolean
  isPro: boolean
  brandId?: string
  distribution: Distribution | null
  breadCrumbs?: BreadcrumbProps
}) => {
  return (
    <Product
      product={product}
      gtin={gtin}
      isOld={isOld}
      isPro={isPro}
      brandId={brandId}
      breadCrumbs={breadCrumbs}
      distribution={distribution}
    />
  )
}

export default ProductPage
