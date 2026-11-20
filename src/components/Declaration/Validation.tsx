"use client"
import Image from "next/image"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import styles from "./Validation.module.css"
import Label from "../Label/Label"
import { SimplifiedDeclarationData } from "../../serverFunctions/upload"
import { Distribution } from "../../db/product"
import Link from "next/link"
import DistributionChart from "../Product/DistributionChart"
import { productMapping } from "../../utils/ecobalyse/mappings"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { getProductIcon } from "../../utils/product/category"

const Validation = ({
  score,
  standardized,
  gtin,
  reset,
  data,
  distribution,
}: {
  data: SimplifiedDeclarationData
  score: number
  standardized: number
  gtin: string
  reset: () => void
  distribution: Distribution | null
}) => {
  const product = Object.entries(productMapping).find(([, value]) => value === data.product)?.[0] ?? data.product
  const icon = distribution ? getProductIcon(distribution.category) : ""
  const difference = distribution?.average
    ? Math.round(Math.abs((standardized - distribution.average) / distribution.average) * 100)
    : 0
  return (
    <>
      <Alert
        severity='success'
        title={`${data.internalReference || data.gtin} - ${data.brandName} a bien été prise en compte`}
        description={
          <>
            Merci pour votre contribution. Sa fiche est désormais consultable par tous, y compris par code-barres, et la
            marque est informée que des citoyens attendent plus de transparence.{" "}
            <Link href={`/produits/${gtin}`} className='fr-link'>
              Voir sa fiche détaillée dans le catalogue
            </Link>
            .
          </>
        }
      />

      <h2 className='fr-mt-4w'>Résultat de votre déclaration :</h2>
      <p className={styles.product}>
        {data.internalReference || data.gtin} - {data.brandName}
      </p>
      {distribution && (
        <>
          <div className='fr-mb-1w'>
            <Badge>
              {icon && <Image src={`/icons/${icon}.svg`} alt='' width={16} height={16} className='fr-mr-1w' />}
              category : {distribution.category}
            </Badge>
          </div>
          <div>
            {standardized > distribution.average ? (
              <Badge severity='error' noIcon>
                <span className='fr-icon fr-icon-arrow-up-s-fill fr-mr-1w' />
                {difference}% de plus que la moyenne de cette catégorie
              </Badge>
            ) : standardized < distribution.average ? (
              <Badge severity='info' noIcon>
                <span className='fr-icon fr-icon-arrow-down-s-fill fr-mr-1w' />
                {difference}% de moins que la moyenne de cette catégorie
              </Badge>
            ) : (
              <Badge severity='warning' noIcon>
                = équivalent à la moyenne de cette catégorie
              </Badge>
            )}
          </div>
        </>
      )}
      <div className={styles.info}>
        <div className={styles.values}>
          <p>
            <span className={styles.value}>{Math.round(score).toLocaleString("fr-FR")}</span>
            <span className={styles.description}>points d’impact pour ce produit</span>
          </p>
          <p>
            <span className={styles.value}>{Math.round(standardized).toLocaleString("fr-FR")}</span>
            <span className={styles.description}>points d’impact pour 100 g</span>
          </p>
        </div>
        <Label product={{ score, standardized }} className={styles.label} />
      </div>
      {distribution && <DistributionChart distribution={distribution} value={standardized} category={product} />}
      <div className={styles.buttons}>
        <Button priority='secondary' linkProps={{ href: "/produits" }}>
          Voir tous mes produits déclarés
        </Button>
        <Button priority='secondary' linkProps={{ href: `/produits/${gtin}` }}>
          Voir ce produit
        </Button>
      </div>
      <div className={styles.box}>
        <p>Souhaitez-vous ajouter un autre produit ?</p>
        <Button onClick={reset}>Déclarer un produit</Button>
      </div>
    </>
  )
}

export default Validation
