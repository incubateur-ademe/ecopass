import Block from "../components/Block/Block"
import styles from "./MentionsLegales.module.css"

const PolitiqueDeConfidentialite = () => {
  return (
    <Block className={styles.container}>
      <h1>Politique de confidentialité</h1>
      <p>
        <strong>Mis à jour le 13/11/2025</strong>
      </p>
      <h2>1. Qui est responsable de la plateforme ?</h2>
      <p>
        La plateforme est sous la responsabilité du Commissariat général au développement durable, représenté par
        monsieur Brice Huet, Commissaire général et délégué interministériel au développement durable.
      </p>
    </Block>
  )
}

export default PolitiqueDeConfidentialite
