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
import DurabilityBadge from "./DurabilityBadge"
import { BreadcrumbProps } from "@codegouvfr/react-dsfr/Breadcrumb"
import Link from "next/link"

const Product = ({
  product,
  gtin,
  isPro,
  isOld,
  brandId,
  breadCrumbs,
}: {
  product: ProductWithScore
  gtin: string
  isPro?: boolean
  isOld?: boolean
  brandId?: string
  breadCrumbs?: BreadcrumbProps
}) => {
  const isBatch = product.informations.length > 1
  const totalScore = computeBatchScore(product)
  return (
    <>
      <Block home breadCrumbs={breadCrumbs}>
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
              <Link href={`/marques/${product.brand?.id}`} className={styles.brandName}>
                {product.brand?.name}
              </Link>
            </h2>
            {!isBatch && product.informations[0].categorySlug !== null && (
              <Image
                src={`/icons/${productMapping[product.informations[0].categorySlug as ProductCategory]}.svg`}
                alt=''
                width={64}
                height={64}
              />
            )}
          </div>
          <div className={styles.productLine} data-testid='product-score'>
            <div className={styles.badges}>
              <Label
                product={{ score: totalScore.score, standardized: totalScore.standardized }}
                className={styles.label}
              />
              {isPro && <DownloadScore score={totalScore} internalReference={product.internalReference} />}
            </div>
            <div className={styles.badges}>
              <Badge severity='info' noIcon>
                coût pour 100g : {Math.round(totalScore.standardized).toLocaleString("fr-FR")} points
              </Badge>
              <DurabilityBadge durability={totalScore.durability} />
            </div>
          </div>
        </div>
        <div data-testid='product-details' className='fr-mt-5w'>
          <p>
            Code-barres : <b>{product.gtins.join(", ")}</b>
          </p>
          <p>
            Déposé le : <b>{formatDate(product.createdAt)}</b>
          </p>
          {product.upload.createdBy.organization && (
            <p>
              Par :{" "}
              <Link href={`/organisations/${product.upload.createdBy.organization.id}`}>
                <b>{product.upload.createdBy.organization.displayName}</b>
              </Link>
            </p>
          )}
          <p>
            Version Ecobalyse : <b>{product.upload.version}</b>
          </p>
        </div>
      </Block>
      <Block>
        {isPro ? <ProductScoreImpacts score={totalScore} /> : <PublicProductScoreImpact score={totalScore} />}
        <ProductHistory gtin={gtin} brandId={brandId} />
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
