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
            <b>{stats.visits}</b> Visites
          </li>
          <li>
            <b>{stats.fileUploads}</b> Dépots de fichier
          </li>
          <li>
            <b>{stats.apiUploads}</b> Dépots par API
          </li>
          <li>
            <b>{Object.values(stats.products).reduce((acc, count) => acc + count, 0)}</b> Produits déclarés :
            <ul className={styles.smallList}>
              {Object.entries(stats.products).map(([category, count]) => (
                <li key={category}>
                  <b>{count}</b> {category}
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
