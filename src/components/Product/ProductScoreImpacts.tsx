import { ProductWithScore } from "../../db/product"
import Table from "../Table/Table"
import styles from "./ProductScore.module.css"
import Link from "next/link"
import Block from "../Block/Block"
import { ponderations } from "../../utils/product/impacts"

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
    <Block>
      <Table
        className='fr-mb-0'
        caption={
          <>
            Détails des impacts environnementaux{" "}
            <Link
              className={styles.link}
              href='https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/explore/textile/impacts'
              target='_blank'
              rel='noreferrer noopener'>
              <span className='fr-icon-questionnaire-line' />
            </Link>
          </>
        }
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
    </Block>
  )
}

export default ProductScoreImpacts
