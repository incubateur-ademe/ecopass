import { Card } from "@codegouvfr/react-dsfr/Card"
import Link from "next/link"
import Block from "../components/Block/Block"
import { Notice } from "@codegouvfr/react-dsfr/Notice"
import HomeBanner from "../components/Home/HomeBanner"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      {!connected && (
        <Notice
          title='Outil en beta privé'
          description={
            <>
              Vous êtes une marque ou un bureau d'études dans le domaine du textile et vous souhaitez tester le portail
              de déclaration de l'affichage environnemental ? Veuillez nous contacter à l'adresse{" "}
              <Link className='fr-link' href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`} prefetch={false}>
                {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
              </Link>
              .
            </>
          }
        />
      )}
      <Block secondary>
        <HomeBanner withConnection={!connected} />
      </Block>
      {connected && (
        <Block>
          <div className='fr-grid-row fr-grid-row--gutters'>
            <div className='fr-col-12 fr-col-md-6'>
              <Card
                background
                border
                enlargeLink
                title='Mes déclarations'
                titleAs='h3'
                desc='Déclarer mes produits et suivre leur status.'
                linkProps={{ href: "/declarations" }}
              />
            </div>
            <div className='fr-col-12 fr-col-md-6'>
              <Card
                background
                border
                enlargeLink
                title='Mes produits'
                titleAs='h3'
                desc='Consulter mes produits déclarés.'
                linkProps={{ href: "/produits" }}
              />
            </div>
          </div>
        </Block>
      )}
    </>
  )
}

export default Home
