import LastBrands from "./LastBrands"
import Search from "../Product/Search"
import styles from "./SearchBanner.module.css"

const SearchBanner = ({ withLastBrands }: { withLastBrands: boolean }) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Recherchez le coût environnemental d'un vêtement</h2>
        <Search withAlert />
      </div>
      {withLastBrands && (
        <div className={styles.tile}>
          <LastBrands />
        </div>
      )}
    </div>
  )
}

export default SearchBanner
