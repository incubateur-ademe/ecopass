import { Card } from "@codegouvfr/react-dsfr/Card"
import Block from "../components/Block/Block"
import HomeBanner from "../components/Home/HomeBanner"
import Logout from "./Logout"
import { Notice } from "@codegouvfr/react-dsfr/Notice"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      <Logout />
      <Notice
        severity='warning'
        title='Maintenance'
        description='Le site est actuellement en maintenance, sa version officielle sera disponible dans les prochains jours.'
      />
      <Block secondary>
        <HomeBanner />
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
