import { ProductWithScore } from "../../db/product"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import ProductScore from "./ProductScore"

const Product = ({ product }: { product: ProductWithScore }) => {
  return (
    <Block>
      <h1>Coût environnemental</h1>
      <Badge severity='success' className='fr-mb-4w'>
        Déclaration validée
      </Badge>
      <div data-testid='product-details'>
        <p className='fr-text--xl fr-mb-1w'>
          <b>
            {product.category}
            {product.brand && <span> - {product.brand}</span>}
          </b>
        </p>
        <p>
          Référence interne : <b>{product.internalReference}</b>
        </p>
        <p>
          Code GTINs : <b>{product.gtins.join(", ")}</b>
        </p>
        <p>
          Déposé le : <b>{formatDate(product.createdAt)}</b>
        </p>
        <p>
          Version Ecobalyse : <b>{product.upload.version}</b>
        </p>
        <div className='fr-mt-4w'>
          {product.score ? (
            <ProductScore score={product.score} internalReference={product.internalReference} />
          ) : (
            <p>Pas de score</p>
          )}
        </div>
      </div>
    </Block>
  )
}

export default Product
