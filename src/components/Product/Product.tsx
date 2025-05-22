import { ProductWithScore } from "../../db/product"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import Label from "../Label/Label"

const Product = ({ product }: { product: ProductWithScore }) => {
  const brand = product.brand || product.upload?.user?.brand?.name
  return (
    <Block>
      <h1>Coût environnemental</h1>
      {brand && <p>Marque : {brand}</p>}
      <p>Code GTIN : {product.gtin}</p>
      <p>Version : {product.upload.version.version}</p>
      <p>Calculé le : {formatDate(product.createdAt)}</p>
      {product.score ? <Label product={product.score} /> : <p>Pas de score</p>}
    </Block>
  )
}

export default Product
