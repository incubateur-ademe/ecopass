import { ProductWithScore } from "../../db/product"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import ProductScore from "./ProductScore"
import ProductHistory from "./ProductHistory"
import ProductScoreImpacts from "./ProductScoreImpacts"
import { BATCH_CATEGORY, productCategories } from "../../utils/types/productCategory"
import { simplifyValue } from "../../utils/parsing/parsing"

const Product = ({ product, gtin, isOld }: { product: ProductWithScore; gtin: string; isOld?: boolean }) => {
  const isBatch = product.informations.length > 1
  const totalScore = {
    ...product.informations.reduce(
      (acc, value) => {
        if (value.score) {
          return {
            acd: acc.acd + value.score.acd,
            cch: acc.cch + value.score.cch,
            durability: acc.durability + value.score.durability,
            etf: acc.etf + value.score.etf,
            fru: acc.fru + value.score.fru,
            fwe: acc.fwe + value.score.fwe,
            htc: acc.htc + value.score.htc,
            htn: acc.htn + value.score.htn,
            ior: acc.ior + value.score.ior,
            ldu: acc.ldu + value.score.ldu,
            microfibers: acc.microfibers + value.score.microfibers,
            mru: acc.mru + value.score.mru,
            outOfEuropeEOL: acc.outOfEuropeEOL + value.score.outOfEuropeEOL,
            ozd: acc.ozd + value.score.ozd,
            pco: acc.pco + value.score.pco,
            pma: acc.pma + value.score.pma,
            swe: acc.swe + value.score.swe,
            tre: acc.tre + value.score.tre,
            wtu: acc.wtu + value.score.wtu,
          }
        }
        return acc
      },
      {
        acd: 0,
        cch: 0,
        durability: 0,
        etf: 0,
        fru: 0,
        fwe: 0,
        htc: 0,
        htn: 0,
        ior: 0,
        ldu: 0,
        microfibers: 0,
        mru: 0,
        outOfEuropeEOL: 0,
        ozd: 0,
        pco: 0,
        pma: 0,
        swe: 0,
        tre: 0,
        wtu: 0,
      },
    ),
    score: product.score ?? 0,
    standardized: product.standardized ?? 0,
  }

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
              {product.brand && <span> - {product.brand}</span>}
            </b>
          </p>
          <p>
            Référence interne : <b>{product.internalReference}</b>
          </p>
          <p>
            Code barre{product.gtins.length > 1 ? "s" : ""} : <b>{product.gtins.join(", ")}</b>
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
          {product.score !== null && product.standardized !== null && (
            <ProductScore
              score={{
                score: product.score,
                standardized: product.standardized,
                durability:
                  product.informations.length === 1 && product.informations[0].score
                    ? product.informations[0].score.durability
                    : 0,
              }}
              internalReference={product.internalReference}
            />
          )}
        </div>
      </Block>
      {totalScore ? <ProductScoreImpacts score={totalScore} /> : null}
      <Block>
        <ProductHistory gtin={gtin} />
      </Block>
    </>
  )
}

export default Product
