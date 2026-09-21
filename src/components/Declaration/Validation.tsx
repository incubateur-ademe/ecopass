"use client"

import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import styles from "./Validation.module.css"
import Label from "../Label/Label"
import { SimplifiedDeclarationData } from "../../serverFunctions/upload"
import { formatDate } from "../../services/format"
import { productMapping } from "../../utils/ecobalyse/mappings"

const Validation = ({
  score,
  standardized,
  durability,
  gtin,
  reset,
  data,
}: {
  data: SimplifiedDeclarationData
  score: number
  standardized: number
  durability: number
  gtin: string
  reset: () => void
}) => {
  return (
    <div className={styles.container}>
      <div>
        <Alert
          severity='success'
          title='Votre déclaration a bien été prise en compte'
          description='Grâce à vous la marque est informée que les citoyens sont en attente de plus de transparence sur ses produits.'
        />

        <div className={styles.info}>
          <div>
            <p className={styles.name}>
              <b>
                {Object.entries(productMapping).find(([key, value]) => value === data.product)?.[0] ?? data.product} -{" "}
                {data.brandName}
              </b>
            </p>
            <p>
              Code barres : <b>{gtin}</b>
            </p>
            <p>
              Déposé le : <b>{formatDate(new Date())}</b>
            </p>
            <p>
              Coût environnemental : <b>{Math.round(score)}</b> points
            </p>
            <p>
              Coût environnemental pour 100g : <b>{Math.round(standardized)}</b> points
            </p>
            <p>
              Coefficient de durabilité : <b>{Math.round(durability * 100) / 100}</b>
            </p>
          </div>
          <Label product={{ score, standardized }} className={styles.label} />
        </div>

        <div className={styles.buttons}>
          <Button priority='secondary' linkProps={{ href: "/produits" }}>
            Voir tous mes produits déclarés
          </Button>
          <Button priority='secondary' linkProps={{ href: `/produits/${gtin}` }}>
            Voir ce produit
          </Button>
        </div>
      </div>
      <div className={styles.box}>
        <p>Souhaitez-vous ajouter un autre produit ?</p>
        <Button onClick={reset}>Déclarer un produit</Button>
      </div>
    </div>
  )
}

export default Validation
