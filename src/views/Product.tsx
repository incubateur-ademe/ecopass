import { BreadcrumbProps } from "@codegouvfr/react-dsfr/Breadcrumb"
import Product from "../components/Product/Product"
import { ProductWithScore } from "../db/product"

const ProductPage = ({
  product,
  gtin,
  isOld,
  isPro,
  brandId,
  breadCrumbs,
  userId,
}: {
  product: ProductWithScore
  gtin: string
  isOld?: boolean
  isPro: boolean
  brandId?: string
  breadCrumbs?: BreadcrumbProps
  userId?: string
}) => {
  return (
    <Product
      product={product}
      gtin={gtin}
      isOld={isOld}
      isPro={isPro}
      brandId={brandId}
      breadCrumbs={breadCrumbs}
      userId={userId}
    />
  )
}

export default ProductPage
