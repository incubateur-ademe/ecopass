import { Card } from "@codegouvfr/react-dsfr/Card"
import Block from "../components/Block/Block"
import { Notice } from "@codegouvfr/react-dsfr/Notice"
import HomeBanner from "../components/Home/HomeBanner"
import Link from "next/link"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      {!connected && (
        <Notice
          title='Outil en beta privé'
          description={
            <>
              Vous pouvez tester le service autant que vous le voulez. Les résultats de vos déclarations ne sont pas
              garantis et seront effacés après la phase de test.
              <br />
              Si vous avez des questions, n’hésitez pas à{" "}
              <Link
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}
                prefetch={false}
                target='_blank'
                rel='noopener noreferrer'>
                nous contacter
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
