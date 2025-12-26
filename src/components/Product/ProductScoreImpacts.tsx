import { ProductWithScore } from "../../db/product"
import Table from "../Table/Table"
import styles from "./ProductScore.module.css"
import { ponderations } from "../../utils/product/impacts"
import Link from "next/link"

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
        caption='Détails des impacts environnementaux'
        fixed
        headers={["Nom", "Valeur", "Pourcentage", ""]}
        data={Object.entries(ponderations)
          .map(([key, { label, base, ponderation }]) => ({
            baseValue: score[key as ScoreKey],
            value: (score[key as ScoreKey] / base) * ponderation * 1_000_000,
            label,
          }))
          .sort((a, b) => b.value - a.value)
          .map(({ value, label }, i, values) => [
            label,
            `${Math.round(value)} pts`,
            <div key={label} className={styles.bar} style={{ width: `${(value / values[0].value) * 100}%` }}></div>,
            (Math.round((value / score.score) * 10_000) / 100).toFixed(2) + "%",
          ])}
      />
    </>
  )
}

export default ProductScoreImpacts
