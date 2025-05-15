import classNames from "classnames"
import { ProductWithScore } from "../../db/product"
import styles from "./Label.module.css"

const Label = ({
  product: { score, standardized },
  secondary,
}: {
  product: Exclude<ProductWithScore["score"], null>
  secondary?: boolean
}) => {
  return (
    <div className={classNames(styles.label, { [styles.secondary]: secondary })}>
      <p className={styles.title}>
        Coût <b>environnemental</b>
      </p>
      <p className={styles.score}>{Math.round(score)}</p>
      <p className={styles.subtitle}>point d'impacts</p>
      <p className={classNames(styles.impact, { [styles.secondaryBackground]: secondary })}>
        {Math.round(standardized)} pts/100g
      </p>
    </div>
  )
}

export default Label
