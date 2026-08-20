import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import { UserOrganization } from "../../db/user"
import OtherBrands from "./Brand/OtherBrands"
import OtherDelegations from "./Delegation/OtherDelegations"
import { OrganizationMember } from "../../db/organization"
import OrganizationMembers from "./OrganizationMembers"

const ConsultancyOrganization = ({
  organization,
  isAdmin,
  members,
}: {
  organization: UserOrganization
  isAdmin: boolean
  members: OrganizationMember[]
}) => {
  return (
    <div data-testid='consultancy-organization'>
      <Tabs
        tabs={[
          {
            label: "Marques",
            content: (
              <>
                <h2>Marques déléguées</h2>
                <OtherBrands organization={organization} />
              </>
            ),
          },
          {
            label: "Délégations",
            content: (
              <>
                <h2>Délégations</h2>
                <OtherDelegations organization={organization} />
              </>
            ),
          },
          {
            label: "Membres",
            content: (
              <>
                <h2>Membres de l'organisation</h2>
                <OrganizationMembers organizationId={organization.id} members={members} isAdmin={isAdmin} />
              </>
            ),
          },
        ]}
      />
    </div>
  )
}

export default ConsultancyOrganization
