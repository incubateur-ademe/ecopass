import Block from "../components/Block/Block"
import Informations from "../components/Dgccrf/Informations"
import Header from "../components/Organization/Header"
import Links from "../components/Organization/Links"
import { Organization } from "../db/organization"

const OrganizationDetail = ({ organization, isAdmin }: { organization: Organization; isAdmin: boolean }) => {
  return (
    <>
      <Block
        home
        breadCrumbs={{
          currentPageLabel: organization.displayName,
          segments: [{ linkProps: { href: "/" }, label: "Accueil" }],
        }}>
        <Header organization={organization} isAdmin={isAdmin} />
      </Block>
      <Block>
        <Links organization={organization} />
      </Block>
      <Block home>
        <Informations />
      </Block>
    </>
  )
}

export default OrganizationDetail
