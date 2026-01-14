import Product from "../components/Product/Product"
import { ProductWithScore } from "../db/product"

const ProductPage = ({
  product,
  gtin,
  isOld,
  isPro,
}: {
  product: ProductWithScore
  gtin: string
  isOld?: boolean
  isPro: boolean
}) => {
  return <Product product={product} gtin={gtin} isOld={isOld} isPro={isPro} />
}

export default ProductPage
