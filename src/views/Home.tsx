import { Tile } from "@codegouvfr/react-dsfr/Tile"
import Block from "../components/Block/Block"
import HomeBanner from "../components/Home/HomeBanner"
import InformationBanner from "../components/Home/InformationBanner"
import SearchBanner from "../components/Home/SearchBanner"
import Badge from "@codegouvfr/react-dsfr/Badge"
import { isTestEnvironment } from "../utils/test"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      <Block large secondary>
        <HomeBanner withConnection={!connected} />
        {connected && (
          <div className='fr-grid-row fr-grid-row--gutters fr-mt-3w'>
            <div className='fr-col-12 fr-col-lg-4'>
              <Tile
                orientation='horizontal'
                start={<Badge>Vos marques</Badge>}
                title='Listez vos marques'
                imageUrl='/images/catalog.svg'
                titleAs='h2'
                desc='Énumérez la liste de vos marques qui ont des produits à déclarer'
                linkProps={{ href: "/organisation" }}
              />
            </div>
            <div className='fr-col-12 fr-col-lg-4'>
              <Tile
                orientation='horizontal'
                start={<Badge>dépôt officiel</Badge>}
                title='Déclarer mes produits'
                imageUrl='/images/contract.svg'
                titleAs='h2'
                desc={
                  <>
                    Déclarer <b>officiellement</b> vos produits et suivez leur statut
                  </>
                }
                linkProps={{ href: "/declarations" }}
              />
            </div>
            <div className='fr-col-12 fr-col-lg-4'>
              <Tile
                orientation='horizontal'
                start={<Badge>Suivi des produits</Badge>}
                title='Consulter mes produits'
                imageUrl='/images/search.svg'
                titleAs='h2'
                desc='Consultez tous vos produits déclarés'
                linkProps={{ href: "/produits" }}
              />
            </div>
          </div>
        )}
      </Block>
      {(connected || !isTestEnvironment()) && (
        <>
          <Block large>
            <SearchBanner />
          </Block>
          <Block large secondary>
            <InformationBanner />
          </Block>
        </>
      )}
    </>
  )
}

export default Home
