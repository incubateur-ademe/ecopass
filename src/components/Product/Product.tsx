import { ProductWithScore } from "../../db/product"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import ProductScore from "./ProductScore"
import ProductHistory from "./ProductHistory"
import ProductScoreImpacts from "./ProductScoreImpacts"
import { productCategories } from "../../utils/types/productCategory"
import { simplifyValue } from "../../utils/parsing/parsing"

const Product = ({ product, gtin, isOld }: { product: ProductWithScore; gtin: string; isOld?: boolean }) => {
  return (
    <>
      <Block>
        <h1>Coût environnemental</h1>
        <Badge severity={isOld ? "warning" : "success"} className='fr-mb-4w'>
          {isOld ? "Déclaration obsolète" : "Déclaration validée"}
        </Badge>
        <div data-testid='product-details'>
          <p className='fr-text--xl fr-mb-1w'>
            <b>
              {productCategories[simplifyValue(product.category)] || product.category}
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
          {product.upload.createdBy.organization && (
            <p>
              Par : <b>{product.upload.createdBy.organization.name}</b>
            </p>
          )}
          <p>
            Version Ecobalyse : <b>{product.upload.version}</b>
          </p>
        </div>
      </Block>
      <Block>
        <div data-testid='product-score'>
          {product.score ? (
            <ProductScore score={product.score} internalReference={product.internalReference} />
          ) : (
            <p>Pas de score</p>
          )}
        </div>
      </Block>
      {product.score ? <ProductScoreImpacts score={product.score} /> : null}
      <Block>
        <ProductHistory gtin={gtin} />
      </Block>
    </>
  )
}

export default Product
