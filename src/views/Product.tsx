import Product from "../components/Product/Product"
import { ProductWithScore } from "../db/product"

const ProductPage = ({ product, gtin, isOld }: { product: ProductWithScore; gtin: string; isOld?: boolean }) => {
  return <Product product={product} gtin={gtin} isOld={isOld} />
}

export default ProductPage
