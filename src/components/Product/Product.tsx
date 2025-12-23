import { ProductWithScore } from "../../db/product"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import { computeBatchScore } from "../../utils/ecobalyse/batches"
import styles from "./Product.module.css"
import Image from "next/image"
import { productMapping } from "../../utils/ecobalyse/mappings"
import Label from "../Label/Label"
import Badge from "@codegouvfr/react-dsfr/Badge"
import ProductHistory from "./ProductHistory"
import PublicProductScoreImpact from "./PublicProductScoreImpact"
import InformationBanner from "../Home/InformationBanner"
import { ProductCategory } from "../../types/Product"
import DownloadScore from "./DownloadScore"
import ProductScoreImpacts from "./ProductScoreImpacts"

const Product = ({
  product,
  gtin,
  isPro,
  isOld,
}: {
  product: ProductWithScore
  gtin: string
  isPro?: boolean
  isOld?: boolean
}) => {
  const isBatch = product.informations.length > 1
  const totalScore = computeBatchScore(product)
  return (
    <>
      <Block home backLink={{ url: "/recherche", label: "Consulter une autre fiche produit" }}>
        {isPro && (
          <Badge severity={isOld ? "warning" : "success"} className='fr-mb-4w'>
            {isOld ? "Déclaration obsolète" : "Déclaration validée"}
          </Badge>
        )}
        <h1>Coût environnemental de ce produit</h1>
        <div className={styles.productBanner}>
          <div className={styles.productLine}>
            <h2 className={styles.title}>
              {product.internalReference}
              <br />
              <span className={styles.brandName}>{product.brand?.name}</span>
            </h2>
            {!isBatch && product.informations[0].categorySlug !== null && (
              <Image
                src={`/icons/${productMapping[product.informations[0].categorySlug as ProductCategory]}.svg`}
                alt=''
                width={32}
                height={32}
              />
            )}
          </div>
          <div className={styles.productLine}>
            <div className={styles.badges}>
              <Label product={{ score: totalScore.score, standardized: totalScore.standardized }} />
              {isPro && <DownloadScore score={totalScore} internalReference={product.internalReference} />}
            </div>
            <div className={styles.badges}>
              <Badge severity='info' noIcon>
                coût pour 100g : {Math.round(totalScore.standardized).toLocaleString("fr-FR")} points
              </Badge>
              <Badge severity='info' noIcon>
                coéfficient de durabilité : {Math.round(totalScore.durability * 100) / 100} points
              </Badge>
            </div>
          </div>
        </div>
      </Block>
      {!isPro && (
        <Block>
          <div data-testid='product-details'>
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
      )}
      <Block>
        {isPro ? <ProductScoreImpacts score={totalScore} /> : <PublicProductScoreImpact score={totalScore} />}
        <ProductHistory gtin={gtin} />
      </Block>
      {!isPro && (
        <Block secondary>
          <InformationBanner />
        </Block>
      )}
    </>
  )
}

export default Product
