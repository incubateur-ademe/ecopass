import Card from "@codegouvfr/react-dsfr/Card"
import styles from "./HomeBanner.module.css"
import Link from "next/link"

const InformationBanner = () => {
  return (
    <div>
      <h2 className={styles.title}>S'informez sur l'impact environnemental des produits textiles</h2>
      <div className={styles.cards}>
        <Card
          background
          border
          enlargeLink
          title="En savoir plus sur l'affichage environnemental"
          desc='Porté par le Gouvernement, l’affichage environnemental sur les vêtements sera déployé dès l’automne 2025. Il vise à rendre compte de leur impact environnemental, et à répondre aux propositions de la Convention citoyenne pour le climat et de la loi Climat et Résilience.'
          linkProps={{
            href: "https://www.ecologie.gouv.fr/politiques-publiques/affichage-environnemental-vetements",
            target: "_blank",
            rel: "noopener noreferrer",
          }}
          titleAs='h3'
        />
        <Card
          background
          border
          enlargeLink
          title='Comment est calculé le coût environnemental ?'
          desc="L'affichage environnemental du textile permet de calculer l'impact de chaque vêtement, en considérant l'ensemble des opérations sur son cycle de vie (ex: fabrication du coton, filage, teinture, ennoblissement, transport, fin de vie)."
          linkProps={{
            href: "https://fabrique-numerique.gitbook.io/ecobalyse/alimentaire/old/pages-textiles-old/demarche",
            target: "_blank",
            rel: "noopener noreferrer",
          }}
          titleAs='h3'
        />
        <Card
          background
          border
          title="Quels sont les textes réglementaires qui encadrent l'affichage du coût environnemental des vêtements ?"
          desc='Le décret et l’arrêté qui encadrent l’affichage volontaire du coût environnemental des vêtements ont été publiés le 9 septembre. Ce cadre technique et réglementaire complet a bénéficié de l’expertise de l’Ademe et d’une large implication des acteurs du secteur textile depuis la loi Climat de 2021.'
          footer={
            <ul className='fr-links-group'>
              <li>
                <Link
                  href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='fr-link'>
                  Le décret
                </Link>
              </li>
              <li>
                <Link
                  href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052213047'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='fr-link'>
                  L'arrêté
                </Link>
              </li>
            </ul>
          }
          titleAs='h3'
        />
        <Card
          background
          border
          title="Quelles sont les règles d'affichage ?"
          desc='Cette charte graphique a été élaborée pour décrire les conditions d’apposition de l’étiquette d’affichage environnemental sur les étiquettes de produits textiles, dans les rayons, sur les supports de communication et en ligne.'
          footer={
            <ul className='fr-links-group'>
              <li>
                <Link href='/charte.pdf' target='_blank' rel='noopener noreferrer' className='fr-link'>
                  La charte graphique
                </Link>
              </li>
              <li>
                <Link href='/documentation/api' target='_blank' rel='noopener noreferrer' className='fr-link'>
                  La documentation pour générer l'étiquette
                </Link>
              </li>
            </ul>
          }
          titleAs='h3'
        />
      </div>
    </div>
  )
}

export default InformationBanner
