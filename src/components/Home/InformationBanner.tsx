import Image from "next/image"
import Block from "../Block/Block"
import styles from "./InformationBanner.module.css"
import { Button } from "@codegouvfr/react-dsfr/Button"

const InformationBanner = () => {
  return (
    <>
      <Block noMargin className={styles.container}>
        <Image className={styles.image} src='/images/homejeans.png' alt='Jeans' width={500} height={500} />
        <div className={styles.text}>
          <h2>Qu’est-ce que le coût environnemental ?</h2>
          <p>
            L’affichage environnemental est une méthode d’évaluation de l’impact environnemental d’un produit sur
            l’ensemble de son cycle de vie. Cela inclut chaque étape, de la production des matières premières à la fin
            de vie du produit.
          </p>
          <Button priority='secondary' className='fr-mt-2w'>
            Tout comprendre
          </Button>
        </div>
      </Block>
      {/*<Block noMargin className={styles.reversedContainer}>
        <Image className={styles.image} src='/images/hometshirt.png' alt='Jeans' width={500} height={500} />
        <div className={styles.text}>
          <h2>Les outils pour vous donner les moyens d’agir</h2>
          <p>
            Nous avons développé un ensemble d’outils de sensibilisation fiables et faciles à utiliser, pour vous vous
            repérer dans ces indicateurs.
          </p>
          <Button priority='secondary' className='fr-mt-2w'>
            Comment ça marche
          </Button>
        </div>
      </Block>*/}
    </>
  )
}

export default InformationBanner
