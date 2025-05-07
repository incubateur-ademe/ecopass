import { ProductWithScore } from "../../db/product"
import styles from "./Label.module.css"

const Label = ({ product: { score, standardized } }: { product: Exclude<ProductWithScore["score"], null> }) => {
  return (
    <div className={styles.label}>
      <p className={styles.title}>
        Coût <b>environnemental</b>
      </p>
      <p className={styles.score}>{Math.round(score)}</p>
      <p className={styles.subtitle}>point d'impacts</p>
      <p className={styles.impact}>{Math.round(standardized)} pts/100g</p>
    </div>
  )
}

export default Label
