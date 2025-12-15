import Product from "../components/Product/Product"
import PublicProduct from "../components/Product/PublicProduct"
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
  return isPro ? (
    <Product product={product} gtin={gtin} isOld={isOld} />
  ) : (
    <PublicProduct product={product} gtin={gtin} />
  )
}

export default ProductPage
