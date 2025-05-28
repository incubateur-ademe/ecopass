import { Card } from "@codegouvfr/react-dsfr/Card"
import Link from "next/link"
import Block from "../components/Block/Block"
import Label from "../components/Label/Label"
import Button from "@codegouvfr/react-dsfr/Button"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      <Block>
        <h1>Affichage environnemental</h1>
        <h2>Déclarez le cout environnemental de vos produits textiles</h2>
      </Block>
      {!connected ? (
        <>
          <Block>
            <Label product={{ score: 360, standardized: 154 }} />
          </Block>
          <Block>
            <Button linkProps={{ href: "/login" }}>Se connecter</Button>
          </Block>
          <Block>
            <p>
              Vous êtes une marque ou un bureau d'études dans le domaine du textile et vous souhaitez tester le portail
              de déclaration de l'affichage environnemental ? Veuillez nous contacter à l'adresse{" "}
              <Link className='fr-link' href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}>
                {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
              </Link>
              .
            </p>
          </Block>
        </>
      ) : (
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
