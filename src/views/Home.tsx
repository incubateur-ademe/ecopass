import { Card } from "@codegouvfr/react-dsfr/Card"
import Block from "../components/Block/Block"
import HomeBanner from "../components/Home/HomeBanner"
import InformationBanner from "../components/Home/InformationBanner"
import SearchBanner from "../components/Home/SearchBanner"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      <Block large secondary>
        <HomeBanner withConnection={!connected} />
        {connected && (
          <div className='fr-grid-row fr-grid-row--gutters fr-mt-3w'>
            <div className='fr-col-12 fr-col-md-6'>
              <Card
                background
                border
                enlargeLink
                title='Mes déclarations'
                titleAs='h2'
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
                titleAs='h2'
                desc='Consulter mes produits déclarés.'
                linkProps={{ href: "/produits" }}
              />
            </div>
          </div>
        )}
      </Block>
      <Block large>
        <SearchBanner />
      </Block>
      <Block large secondary>
        <InformationBanner />
      </Block>
    </>
  )
}

export default Home
