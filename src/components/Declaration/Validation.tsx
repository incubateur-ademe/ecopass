"use client"

import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import styles from "./Validation.module.css"
import Label from "../Label/Label"

const Validation = ({
  score,
  standardized,
  gtin,
  reset,
}: {
  score: number
  standardized: number
  gtin: string
  reset: () => void
}) => {
  return (
    <div>
      <Alert
        severity='success'
        title='Votre déclaration a bien été prise en compte'
        description='Grâce à vous la marque est informée que les citoyens sont en attente de plus de transparence sur ses produits.'
      />

      <Label product={{ score, standardized }} className={styles.label} />

      <div className={styles.buttons}>
        <Button priority='secondary' linkProps={{ href: `/produits/${gtin}` }}>
          Voir le produit
        </Button>
        <Button onClick={reset}>Déclarer un autre produit</Button>
      </div>
    </div>
  )
}

export default Validation
