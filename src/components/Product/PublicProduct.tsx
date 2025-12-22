import { ProductWithScore } from "../../db/product"
import { formatDate } from "../../services/format"
import Block from "../Block/Block"
import { computeBatchScore } from "../../utils/ecobalyse/batches"
import styles from "./PublicProduct.module.css"
import Image from "next/image"
import { productMapping } from "../../utils/ecobalyse/mappings"
import Label from "../Label/Label"
import Badge from "@codegouvfr/react-dsfr/Badge"
import ProductHistory from "./ProductHistory"
import PublicProductScoreImpact from "./PublicProductScoreImpact"
import InformationBanner from "../Home/InformationBanner"
import { ProductCategory } from "../../types/Product"

const PublicProduct = ({ product, gtin }: { product: ProductWithScore; gtin: string }) => {
  const isBatch = product.informations.length > 1
  const totalScore = computeBatchScore(product)
  return (
    <>
      <Block home backLink={{ url: "/recherche", label: "Consulter une autre fiche produit" }}>
        <h1>Coût environnemental de ce produit</h1>
        <div className={styles.productBanner}>
          <div className={styles.productLine}>
            <h2 className={styles.title}>
              {product.internalReference}
              <br />
              {product.brand?.name}
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
            <Label product={{ score: totalScore.score, standardized: totalScore.standardized }} />
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
      <PublicProductScoreImpact score={totalScore} />
      <Block>
        <ProductHistory gtin={gtin} />
      </Block>
      <Block secondary>
        <InformationBanner />
      </Block>
    </>
  )
}

export default PublicProduct
