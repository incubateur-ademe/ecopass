import Block from "../components/Block/Block"
import styles from "./MentionsLegales.module.css"

const MentionsLegales = () => {
  return (
    <Block className={styles.container}>
      <h1>Mentions légales</h1>
      <p>Mis à jour le 12/09/2025</p>
      <h2>Éditeur du site</h2>
      <p>
        Commissariat général au développement durable
        <br />
        Tour Séquoia
        <br />1 place Carpeaux
        <br />
        92800 Puteaux France
      </p>
      <h2>Directeur de la publication</h2>
      <p>Monsieur Brice Huet, Commissaire général</p>
      <h2>Hébergement du site</h2>
      <p>Ce site est hébergé par :</p>
      <p>
        Scalingo
        <br />
        13 rue Jacques Peirotes
        <br />
        67000 Strasbourg
        <br />
        01 84 13 00 00
      </p>
      <h2>Accessibilité</h2>
      <p>
        La conformité aux normes d'accessibilité numérique est un objectif ultérieur mais nous tâchons de rendre ce site
        accessible à toutes et à tous.
      </p>
      <h2>Signaler un dysfonctionnement</h2>
      <p>
        Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du
        site, merci de nous en faire part.
      </p>
      <p>
        Si vous n'obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une
        demande de saisine au Défenseur des droits.
      </p>
    </Block>
  )
}

export default MentionsLegales
