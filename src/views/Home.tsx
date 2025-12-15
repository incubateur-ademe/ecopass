import { Tile } from "@codegouvfr/react-dsfr/Tile"
import Block from "../components/Block/Block"
import HomeBanner from "../components/Home/HomeBanner"
import KeyResults from "../components/Home/KeyResults"
import SearchBanner from "../components/Home/SearchBanner"
import Badge from "@codegouvfr/react-dsfr/Badge"
import { isTestEnvironment } from "../utils/test"
import { OrganizationType } from "../../prisma/src/prisma"
import { organizationTypesAllowedToDeclare } from "../utils/organization/canDeclare"
import InformationBanner from "../components/Home/InformationBanner"
import InformationProBanner from "../components/Home/InformationProBanner"

const Home = ({ connected, type, isPro }: { connected?: boolean; type: OrganizationType | null; isPro?: boolean }) => {
  const isAllowedToDeclare = !type || organizationTypesAllowedToDeclare.includes(type)
  return (
    <>
      {isAllowedToDeclare && (
        <Block large home>
          <HomeBanner withConnection={!connected} isPro={isPro} />
          {connected && (
            <div className='fr-grid-row fr-grid-row--gutters fr-mt-3w'>
              <div className='fr-col-12 fr-col-lg-4'>
                <Tile
                  orientation='horizontal'
                  start={<Badge>Organisation</Badge>}
                  title='Gérez votre entreprise'
                  imageUrl='/images/catalog.svg'
                  titleAs='h2'
                  desc='Listez vos marques et organisez vos délégations.'
                  linkProps={{ href: "/organisation" }}
                />
              </div>
              <div className='fr-col-12 fr-col-lg-4'>
                <Tile
                  orientation='horizontal'
                  start={<Badge>dépôt officiel</Badge>}
                  title='Déclarer vos produits'
                  imageUrl='/images/contract.svg'
                  titleAs='h2'
                  desc={
                    <>
                      Déclarez <b>officiellement</b> vos produits et suivez leur statut.
                    </>
                  }
                  linkProps={{ href: "/declarations" }}
                />
              </div>
              <div className='fr-col-12 fr-col-lg-4'>
                <Tile
                  orientation='horizontal'
                  start={<Badge>produits</Badge>}
                  title='Consulter vos produits'
                  imageUrl='/images/search.svg'
                  titleAs='h2'
                  desc='Retrouvez ici tous vos produits déclarés.'
                  linkProps={{ href: "/produits" }}
                />
              </div>
            </div>
          )}
        </Block>
      )}
      {(connected || !isTestEnvironment()) && (
        <>
          <Block large>
            <SearchBanner withLastBrands={!isPro} />
          </Block>
          {isPro ? (
            <Block large secondary>
              <InformationProBanner />
            </Block>
          ) : (
            <>
              <Block large secondary>
                <InformationBanner />
              </Block>
              <Block>
                <KeyResults />
              </Block>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Home
