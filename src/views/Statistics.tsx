import Block from "../components/Block/Block"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { Card } from "@codegouvfr/react-dsfr/Card"
import Metabase from "../components/Stats/Metabase"
import styles from "./Statistics.module.css"

type Token = {
  type: "dashboard" | "question"
  token: string
}

const Statistics = ({
  total,
  tokens,
}: {
  total: number
  tokens: { general: Token; brands: Token; products: Token }
}) => {
  return (
    <>
      <Block
        breadCrumbs={{
          currentPageLabel: "Statistiques",
          segments: [{ linkProps: { href: "/" }, label: "Accueil" }],
        }}>
        <h1>Statistiques du coût environnemental des produits textiles</h1>
        <p>Suivez le nombre de produits et de marques déclarés sur le portail.</p>
        <h2 className='fr-mt-4w'>Chiffres généraux</h2>
        <div className={styles.metabaseGeneral}>
          <Metabase token={tokens.general.token} type={tokens.general.type} />
        </div>
        <h2 className='fr-mt-4w'>Évolution du catalogue</h2>
        <div className={styles.metabaseBrands}>
          <Metabase token={tokens.brands.token} type={tokens.brands.type} />
        </div>
        <h2 className='fr-mt-4w'>Représentation de la typologie de produit actuelle</h2>
        <p>
          Sur un total de{" "}
          <Badge severity='info' noIcon as='span'>
            {total} produits
          </Badge>
        </p>
        <div className={styles.metabaseProducts}>
          <Metabase token={tokens.products.token} type={tokens.products.type} />
        </div>
        {/*<h2 className='fr-mt-4w'>Impact des produits selon les paramètres de fabrication</h2>*/}
        <h2 className='fr-mt-4w'>Aller plus loin avec la donnée</h2>
        <Card
          title='Télécharger les données publiques du catalogue, accédez aux scores et à leur décomposition'
          horizontal
          imageUrl='/images/datagouv.png'
          imageAlt=''
          endDetail='Consulter les données sur datagouv.fr'
          linkProps={{
            href: "https://www.data.gouv.fr/datasets/affichage-environnemental-des-vetements",
          }}
          enlargeLink
        />
      </Block>
    </>
  )
}

export default Statistics
