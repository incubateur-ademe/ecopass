import classNames from "classnames"
import { Distribution } from "../../db/product"
import styles from "./DistributionChart.module.css"

const DistributionChart = ({ distribution, value }: { distribution: Distribution; value: number }) => {
  if (!distribution) {
    return null
  }

  const { min, max, average, averageQuantileIndex, counts } = distribution

  const maxValue = Math.max(...counts)
  const normalizedValues = counts.map((value) => (maxValue > 0 ? (value / maxValue) * 100 : 0))

  let valueIndex = 0
  for (let i = 0; i < counts.length; i++) {
    console.log(value, counts[i])
    if (value <= counts[i]) {
      valueIndex = i
      break
    }
  }

  return (
    <div className={styles.chart}>
      <div className={styles.bars}>
        {normalizedValues.map((normalizedValue, index) => (
          <div key={index} className={styles.barContainer}>
            <div
              className={classNames(styles.bar, {
                [styles.average]: index === valueIndex,
              })}
              style={{ height: `${normalizedValue}%` }}>
              {index === averageQuantileIndex && (
                <div className={styles.meanBar}>
                  <p className={styles.meanLabel}>Moyenne {Math.round(average).toLocaleString("fr-FR")} ps/100g</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.labels}>
        <p>
          <span className={styles.labelText}>Coût minimal</span>
          <span className={classNames(styles.labelValue, styles.left)}>
            {Math.round(min).toLocaleString("fr-FR")} ps/100g
          </span>
        </p>

        <div className={styles.label}>
          <span className={styles.labelText}>Coût maximal</span>
          <span className={classNames(styles.labelValue, styles.right)}>
            {Math.round(max).toLocaleString("fr-FR")} ps/100g
          </span>
        </div>
      </div>
    </div>
  )
}

export default DistributionChart
