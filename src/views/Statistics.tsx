import Block from "../components/Block/Block"
import { Stats } from "../services/stats/stats"
import styles from "./Statistics.module.css"

const Statistics = ({ stats }: { stats: Stats }) => {
  return (
    <>
      <Block>
        <h1>Statistiques</h1>
        <ul className={styles.list}>
          <li>
            <b>{stats.visits.toLocaleString("fr-FR")}</b> visites
          </li>
          <li>
            <b>{stats.fileUploads.toLocaleString("fr-FR")}</b> CSV déposés
          </li>
          <li>
            <b>{stats.apiUploads.toLocaleString("fr-FR")}</b> produits déclarés via l'API
          </li>
          <li>
            <b>
              {Object.values(stats.products)
                .reduce((acc, count) => acc + count, 0)
                .toLocaleString("fr-FR")}
            </b>{" "}
            produits déclarés :
            <ul className={styles.smallList}>
              {Object.entries(stats.products).map(([category, count]) => (
                <li key={category}>
                  <b>{count.toLocaleString("fr-FR")}</b> {category}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </Block>
    </>
  )
}

export default Statistics
