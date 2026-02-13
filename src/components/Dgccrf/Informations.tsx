import Tile from "@codegouvfr/react-dsfr/Tile"
import Contact from "../Organization/Contact"

const Informations = () => {
  return (
    <>
      <h2>Tous les outils pour vous accompagner</h2>
      <div className='fr-grid-row fr-grid-row--gutters fr-mt-3w'>
        <div className='fr-col-12 fr-col-lg-4'>
          <Tile
            orientation='horizontal'
            title='Documentation de la déclaration de du coût environnemental'
            imageUrl='/images/catalog.svg'
            titleAs='h3'
            desc='Consulter la matrice de données.'
            linkProps={{ href: "/organisation" }}
          />
        </div>
        <div className='fr-col-12 fr-col-lg-4'>
          <Tile
            orientation='horizontal'
            title='Charte graphique officielle'
            imageUrl='/images/conclusion.svg'
            titleAs='h3'
            desc='Les affichages à respecter.'
            linkProps={{ href: "/charte.pdf", target: "_blank", rel: "noopener noreferrer" }}
          />
        </div>
        <div className='fr-col-12 fr-col-lg-4'>
          <Tile
            orientation='horizontal'
            title='Consulter le tableau d’ordre de grandeur'
            imageUrl='/images/search.svg'
            titleAs='h3'
            desc='Un outil pédagogique simple.'
            linkProps={{ href: "/dgccrf/ordres-de-grandeur" }}
          />
        </div>
      </div>
      <Contact />
    </>
  )
}

export default Informations
