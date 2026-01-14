import Link from "next/link"
import KeyResult from "./KeyResult"
import styles from "./KeyResults.module.css"

const KeyResults = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Chiffres clés</h2>
      <div className={styles.grid}>
        <KeyResult
          imageSrc='/images/key-results/sewing-machine.png'
          source="Source : Estimation d'après le baromètre Refashion sur les ventes 2022">
          <p>
            <span>Environ</span>
            <strong>7 MILLIONS DE VÊTEMENTS NEUFS</strong>
            <span>sont achetés par jour en France.</span>
          </p>
        </KeyResult>
        <KeyResult
          imageSrc='/images/key-results/clothes-pile.png'
          source='Source : Volumes and destruction of returned and unsold textiles in Europe‘s circular economy, ETC CE Report 2024/4 Volumes'>
          <p>Plus de</p>
          <p>
            <strong>45 MILLIARDS DE VÊTEMENTS EN EXCÉDENT</strong>
          </p>
          <p>(invendus) chaque année dans le monde.</p>
        </KeyResult>
        <KeyResult
          imageSrc='/images/key-results/polar-bear.png'
          source='Source : EU Strategy for Sustainable and Circular Textiles'>
          <p>La consommation européenne de textiles représente la</p>
          <p>
            <strong>
              4<sup>e</sup> SOURCE D&apos;IMPACTS SUR L&apos;ENVIRONNEMENT
            </strong>
          </p>
          <p>de l&apos;UE, après l&apos;alimentation, le logement et les transports.</p>
        </KeyResult>
        <KeyResult imageSrc='/images/key-results/clothes-bag.png' source="Source : Refashion, Rapport d'activité 2022">
          <p>Chaque Français a acheté en moyenne</p>
          <p>
            <strong>40 PIÈCES D&apos;HABILLEMENT ET 4 PAIRES DE CHAUSSURES EN 2022.</strong>
          </p>
        </KeyResult>
      </div>
      <p className={styles.sourceNote}>
        Source :{" "}
        <Link
          href='https://librairie.ademe.fr/consommer-autrement/7747-tout-comprendre-les-impacts-de-la-mode-et-de-la-fast-fashion-9791029724602.html'
          target='_blank'
          rel='noopener noreferrer'>
          &quot;Tout comprendre : les impacts de la mode et de la fast-fashion&quot;
        </Link>
        , fascicule édité par l&apos;ADEME
      </p>
    </section>
  )
}

export default KeyResults
