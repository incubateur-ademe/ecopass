import classNames from "classnames"
import { Distribution } from "../../db/product"
import styles from "./DistributionChart.module.css"

const DistributionChart = ({
  distribution,
  value,
  category,
}: {
  distribution: Distribution
  value: number
  category: string
}) => {
  if (!distribution) {
    return null
  }

  const { min, max, average, averageQuantileIndex, counts, valuePercentile, valuePercentileIndex } = distribution

  const maxValue = Math.max(...counts)
  const normalizedValues = counts.map((value) => (maxValue > 0 ? (value / maxValue) * 100 : 0))

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <p className={styles.title}>Comment se situe cette référence parmi les {category} déclaré(e)s ?</p>
        <p className={styles.description}>
          Avec <b>{Math.round(value).toLocaleString("fr-FR")}</b> points pour 100 g, ce(tte) {category.toLowerCase()} a
          un coût environnemental{" "}
          <b>
            {average !== 0 ? Math.round(Math.abs((value - average) / average) * 100) : 0}%{" "}
            {value < average ? "inférieur" : "supérieur"}
          </b>{" "}
          à la moyenne des {category.toLowerCase()} ({Math.round(average).toLocaleString("fr-FR")} points). Il (Elle)
          fait partie des <b>{Math.round(valuePercentile).toLocaleString("fr-FR")}% les moins impactants</b>.
        </p>
      </div>
      <div className={styles.chart}>
        <div className={styles.bars}>
          <div className={styles.border} />
          {normalizedValues.map((normalizedValue, index) => (
            <div key={index} className={styles.barContainer}>
              <div
                className={classNames(styles.bar, {
                  [styles.average]: index === valuePercentileIndex,
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
          <div className={styles.border} />
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
    </div>
  )
}

export default DistributionChart
