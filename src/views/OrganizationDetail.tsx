import Block from "../components/Block/Block"
import Informations from "../components/Dgccrf/Informations"
import Links from "../components/Organization/Links"
import { Organization } from "../db/organization"
import { organizationTypes } from "../utils/organization/types"

const OrganizationDetail = ({ organization }: { organization: Organization }) => {
  return (
    <>
      <Block
        home
        breadCrumbs={{
          currentPageLabel: organization.displayName,
          segments: [{ linkProps: { href: "/" }, label: "Accueil" }],
        }}>
        <h1>{organization.name}</h1>
        {organization.displayName !== organization.name && (
          <p>
            Nom d'usage : <b>{organization.displayName}</b>
          </p>
        )}
        {organization.type && (
          <p>
            Type : <b>{organizationTypes[organization.type]}</b>
          </p>
        )}
        {organization.siret && (
          <p>
            SIRET : <b>{organization.siret}</b>
          </p>
        )}
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
