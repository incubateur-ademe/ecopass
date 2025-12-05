import { ProductWithScore } from "../../db/product"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import ProductScore from "./ProductScore"
import ProductHistory from "./ProductHistory"
import ProductScoreImpacts from "./ProductScoreImpacts"
import { BATCH_CATEGORY, productCategories } from "../../utils/types/productCategory"
import { simplifyValue } from "../../utils/parsing/parsing"
import { computeBatchScore } from "../../utils/ecobalyse/batches"

const Product = ({ product, gtin, isOld }: { product: ProductWithScore; gtin: string; isOld?: boolean }) => {
  const isBatch = product.informations.length > 1
  const totalScore = computeBatchScore(product)
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
              {isBatch
                ? BATCH_CATEGORY
                : productCategories[simplifyValue(product.informations[0].category)] ||
                  product.informations[0].category}
              {product.brand && <span> - {product.brand.name}</span>}
            </b>
          </p>
          <p>
            Référence interne : <b>{product.internalReference}</b>
          </p>
          <p>
            Code-barres{product.gtins.length > 1 ? "s" : ""} : <b>{product.gtins.join(", ")}</b>
          </p>
          <p>
            Déposé le : <b>{formatDate(product.createdAt)}</b>
          </p>
          {product.upload.createdBy.organization && (
            <p>
              Par : <b>{product.upload.createdBy.organization.displayName}</b>
            </p>
          )}
          <p>
            Version Ecobalyse : <b>{product.upload.version}</b>
          </p>
        </div>
      </Block>
      <Block>
        <div data-testid='product-score'>
          {product.score !== null && product.standardized !== null && (
            <ProductScore
              score={{
                score: product.score,
                standardized: product.standardized,
                durability: totalScore.durability,
              }}
              internalReference={product.internalReference}
            />
          )}
        </div>
      </Block>
      <ProductScoreImpacts score={totalScore} />
      <Block>
        <ProductHistory gtin={gtin} />
      </Block>
    </>
  )
}

export default Product
