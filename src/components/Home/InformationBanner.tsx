import Card from "@codegouvfr/react-dsfr/Card"
import styles from "./HomeBanner.module.css"
import Link from "next/link"

const InformationBanner = () => {
  return (
    <div>
      <h2 className={styles.title}>Informez-vous sur l'impact environnemental des produits textiles</h2>
      <div className={styles.cards}>
        <Card
          background
          border
          title='Qu’est-ce que l’affichage environnemental ?'
          desc='Porté par le Gouvernement, l’affichage environnemental sur les vêtements sera déployé dès l’automne 2025. Il vise à rendre compte de leur impact environnemental, et à répondre aux propositions de la Convention citoyenne pour le climat et de la loi Climat et Résilience.'
          titleAs='h3'
          footer={
            <Link
              href='https://www.ecologie.gouv.fr/politiques-publiques/affichage-environnemental-vetements'
              target='_blank'
              rel='noopener noreferrer'
              className='fr-link'>
              Consultez le site du ministère pour plus d'informations
            </Link>
          }
        />
        <Card
          background
          border
          title='Comment est calculé le coût environnemental ?'
          desc="L'affichage environnemental du textile permet de calculer l'impact de chaque vêtement, en considérant l'ensemble des opérations sur son cycle de vie (ex: fabrication du coton, filage, teinture, ennoblissement, transport, fin de vie)."
          titleAs='h3'
          footer={
            <Link href='/notice-reglementaire.pdf' target='_blank' rel='noopener noreferrer' className='fr-link'>
              Téléchargez la notice règlementaire (PDF, 1.5 Mo)
            </Link>
          }
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
                  Consultez le décret
                </Link>
              </li>
              <li>
                <Link
                  href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052213047'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='fr-link'>
                  Consultez l'arrêté
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
                  Téléchargez la charte graphique (PDF, 2.9 Mo)
                </Link>
              </li>
              <li>
                <Link href='/documentation/api' target='_blank' rel='noopener noreferrer' className='fr-link'>
                  Consultez la documentation API pour générer les étiquettes
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
