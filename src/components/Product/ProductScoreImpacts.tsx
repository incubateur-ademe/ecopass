import { ProductWithScore } from "../../db/product"
import Table from "../Table/Table"
import styles from "./ProductScore.module.css"
import { ponderations } from "../../utils/product/impacts"
import Link from "next/link"
import ProductLifeCycleImpacts from "./ProductLifeCycleImpacts"

type ScoreKey = keyof typeof ponderations

const ProductScoreImpacts = ({
  score,
}: {
  score: Omit<NonNullable<ProductWithScore["informations"][number]["score"]>, "id" | "productId">
}) => {
  if (!Object.keys(ponderations).some((key) => score[key as ScoreKey] > 0)) {
    return null
  }

  return (
    <>
      {score.materials !== null && score.materials > 0 && (
        <>
          <h2>Détails du cycle de vie</h2>
          <ProductLifeCycleImpacts score={score} />
        </>
      )}
      <h2>Détails des impacts environnementaux</h2>
      <div>
        <Link
          href='https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/explore/textile/impacts'
          target='_blank'
          rel='noreferrer noopener'>
          Vous pouvez consulter un tableau plus complet du calcul sur Ecobalyse
        </Link>
      </div>
      <Table
        className='fr-mt-4w'
        noCaption
        fixed
        caption='Détails des impacts environnementaux'
        headers={["Nom", "Valeur", "Pourcentage", ""]}
        data={Object.entries(ponderations)
          .map(([key, { label, base, ponderation }]) => ({
            value: (score[key as ScoreKey] / base) * ponderation * 1_000_000,
            label,
          }))
          .sort((a, b) => b.value - a.value)
          .map(({ value, label }) => {
            const percent = score.score > 0 ? (value / score.score) * 100 : 0
            const percentLabel = (Math.round(percent * 100) / 100).toFixed(2) + "%"
            return [
              label,
              `${Math.round(value)} pts`,

              <div key={label} className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${Math.min(percent, 100)}%` }}></div>
              </div>,
              percentLabel,
            ]
          })}
      />
    </>
  )
}

export default ProductScoreImpacts
