import { ProductWithScore } from "../../db/product"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import ProductScore from "./ProductScore"

const Product = ({ product }: { product: ProductWithScore }) => {
  const brand = product.brand || product.upload?.user?.brand?.name

  return (
    <Block>
      <h1>Coût environnemental</h1>
      <Badge severity='success' className='fr-mb-4w'>
        Déclaration validée
      </Badge>{" "}
      <p className='fr-text--xl fr-mb-1w'>
        <b>
          {product.category}
          {brand && <span> - {brand}</span>}
        </b>
      </p>
      <p>
        Code GTIN : <b>{product.gtin}</b>
      </p>
      <p>
        Déposé le : <b>{formatDate(product.createdAt)}</b>
      </p>
      <p>
        Version Écobalyse: <b>{product.upload.version.version}</b>
      </p>
      <div className='fr-mt-4w'>{product.score ? <ProductScore product={product} /> : <p>Pas de score</p>}</div>
    </Block>
  )
}

export default Product
