import Image from "next/image"
import styles from "./OtherOrganization.module.css"
import Search from "../Product/Search"
import Contact from "./Contact"

const OtherOrganization = () => {
  return (
    <div data-testid='other-organization'>
      <h1>
        L’accès connecté au portail est actuellement restreint.
        <br />
        Nous vous remercions de votre compréhension.
      </h1>
      <p>
        Pour le moment, la partie connectée du portail n’est accessible qu’aux marques textiles, aux distributeurs ou
        aux bureaux d’études accompagnant les professionnels du secteur.
      </p>
      <div className={styles.box}>
        <Image src='/images/other.png' alt='' width={325} height={304} />
        <div className={styles.content}>
          <h2>Vous êtes... ?</h2>
          <ul>
            <li>Un consommateur, </li>
            <li>un acteur ou une association de l’environnement, </li>
            <li>un acheteur, </li>
            <li>un responsable RSE, </li>
            <li>un élu, </li>
            <li>un journaliste, </li>
            <li>un chargé de communication, </li>
            <li>une personne du milieu éducatif, </li>
            <li>... ? </li>
          </ul>
          <Contact />
        </div>
      </div>
      <p>
        Vous pouvez également rechercher un produit par son code-barres pour avoir plus d'informations sur son coût
        environnemental.
      </p>
      <Search />
    </div>
  )
}

export default OtherOrganization
