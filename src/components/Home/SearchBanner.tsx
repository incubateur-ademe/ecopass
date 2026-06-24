import Search from "../Product/Search"
import styles from "./SearchBanner.module.css"

const SearchBanner = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Cherchez le coût environnemental d'un produit</h2>
        <Search />
      </div>
    </div>
  )
}

export default SearchBanner
