import { ProductWithScore } from "../../db/product"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import Label from "../Label/Label"

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
        Version : <b>{product.upload.version.version}</b>
      </p>
      {product.score && (
        <>
          <p>
            Coût environnemental : <b>{Math.round(product.score.score)} points</b>
          </p>
          <p>
            Coût environnemental pour 100g : <b>{Math.round(product.score.standardized)} points</b>
          </p>
        </>
      )}
      <div className='fr-mt-4w'>{product.score ? <Label product={product.score} /> : <p>Pas de score</p>}</div>
    </Block>
  )
}

export default Product
