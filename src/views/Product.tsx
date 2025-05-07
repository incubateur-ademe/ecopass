import Product from "../components/Product/Product"
import { ProductWithScore } from "../db/product"

const ProductPage = ({ product }: { product: ProductWithScore }) => {
  return <Product product={product} />
}

export default ProductPage
