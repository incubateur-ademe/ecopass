"use client"

import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { ConfidenceLevel } from "@prisma/enums"
import styles from "./DurabilityBadge.module.css"
import { createModal } from "@codegouvfr/react-dsfr/Modal"
import Table from "../Table/Table"

const confidencesLevel = {
  [ConfidenceLevel.High]: "FORT",
  [ConfidenceLevel.Medium]: "MOYEN",
  [ConfidenceLevel.Low]: "FAIBLE",
}

const modal = createModal({
  id: "confidence-level-modal",
  isOpenedByDefault: false,
})

const ConfidenceLevelBadge = ({ confidenceLevel }: { confidenceLevel: ConfidenceLevel }) => {
  return (
    <>
      <div className={styles.container} data-testid='confidence-level-badge'>
        <p>Indice de confiance :</p>
        <Badge severity='info' noIcon>
          {confidencesLevel[confidenceLevel]}
        </Badge>
        <button
          className={styles.infoButton}
          onClick={() => modal.open()}
          aria-label="Informations sur l'indice de confiance">
          ?
        </button>
      </div>
      <modal.Component title='Règles de calculs du coût de ce produit'>
        <p>
          Le coût environnemental se calcule par une moyenne pondérée par indice de confiance des calculs effectués par
          des tiers, si la marque n'a pas déclaré par elle-même le coût environnemental de son produit
        </p>
        <br />
        <Table
          headers={["Déclarant", "Indice de pondération"]}
          data={[
            [
              "Marque propriétaire de la référence",
              <Badge severity='info' noIcon key='marque'>
                FORT
              </Badge>,
            ],
            [
              "Entreprise déléguée par la marque",
              <Badge severity='info' noIcon key='marque'>
                FORT
              </Badge>,
            ],
            [
              "Entreprise tierce",
              <Badge severity='info' noIcon key='marque'>
                MOYEN
              </Badge>,
            ],
            [
              "Citoyen",
              <Badge severity='info' noIcon key='marque'>
                FAIBLE
              </Badge>,
            ],
          ]}
        />
        <p>
          <b>Règle de déclaration d’une marque propriétaire de la référence :</b>
        </p>
        <br />
        <p>
          <b>D’après 'Art. D. 541-244 du décret n° 2025-957 du 6 septembre 2025 :</b>
        </p>
        <br />
        <p>
          ”Si le fabricant, l'importateur ou tout autre metteur sur le marché détermine lui-même le coût environnemental
          d'une de ses références de produit textile ou l'actualise, alors ce coût environnemental est l'information
          utilisée par toute personne communiquant volontairement dessus”
        </p>
        <br />
        <p>
          Le coût environnemental déclaré par la marque propriétaire d’une référence prévaut sur toute valeur calculée à
          partir des déclarations antérieures. La détention exclusive des données détaillées du produit confère à cette
          marque un droit d’édition et de validation exclusif du coût environnemental associé à la référence.
        </p>
      </modal.Component>
    </>
  )
}

export default ConfidenceLevelBadge
