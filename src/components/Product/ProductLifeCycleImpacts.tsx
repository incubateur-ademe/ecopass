import { ProductWithScore } from "../../db/product"
import Table from "../Table/Table"
import styles from "./ProductScore.module.css"
import { lifeCycleStages, ponderations } from "../../utils/product/impacts"

type ScoreKey = keyof typeof ponderations

type ProductLifeCycleImpactsProps = {
  score: Omit<NonNullable<ProductWithScore["informations"][number]["score"]>, "id" | "productId">
}

const ProductLifeCycleImpacts = ({ score }: ProductLifeCycleImpactsProps) => (
  <Table
    noCaption
    className='fr-mt-4w'
    fixed
    headers={["Nom", "Valeur", "Pourcentage", ""]}
    data={Object.entries(lifeCycleStages)
      .map(([key, label]) => ({
        value: (score[key as ScoreKey] || 0) / score.durability,
        label,
      }))
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
)

export default ProductLifeCycleImpacts
