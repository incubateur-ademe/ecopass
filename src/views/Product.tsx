import Product from "../components/Product/Product"
import { ProductWithScore } from "../db/product"

const ProductPage = ({
  product,
  gtin,
  isOld,
  isPro,
  brandId,
}: {
  product: ProductWithScore
  gtin: string
  isOld?: boolean
  isPro: boolean
  brandId?: string
}) => {
  return <Product product={product} gtin={gtin} isOld={isOld} isPro={isPro} brandId={brandId} />
}

export default ProductPage
