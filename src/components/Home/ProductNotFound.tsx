import { Button } from "@codegouvfr/react-dsfr/Button"
import styles from "./ProductNotFound.module.css"
import Image from "next/image"

const ProductNotFound = ({ fromSearch }: { fromSearch?: boolean }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3>
          {fromSearch ? "Vous ne trouvez pas le produit que vous cherchez ?" : "Vous ne trouvez pas ce produit ?"}
        </h3>
        <p>Contribuez à enrichir la base de données en ajoutant vous-même les références encore absentes.</p>
        <Button linkProps={{ href: "/declaration-simplifiee" }}>Ajouter une référence</Button>
        {!fromSearch && (
          <>
            <div className={styles.line} />
            <p>Ou vous pouvez aussi préciser votre recherche :</p>
            <Button priority='secondary' iconId='fr-icon-settings-5-line'>
              Préciser ma recherche
            </Button>
          </>
        )}
      </div>
      <Image src='/images/searchjeans.png' alt='' width={625} height={442} className={styles.image} />
    </div>
  )
}

export default ProductNotFound
