import Search from "../Product/Search"
import styles from "./HomeBanner.module.css"

const SearchBanner = () => {
  return (
    <div>
      <h2 className={styles.title}>Trouvez le coût environnemental de vos vêtements</h2>
      <p className={styles.description}>
        Vous êtes un consommateur et souhaitez en savoir plus sur les produits textiles que vous achetez ?
        <br />
        Vous pouvez rechercher un produit par son code-barres pour avoir plus d'informations sur son coût
        environnemental.
      </p>
      <Search withAlert />
    </div>
  )
}

export default SearchBanner
