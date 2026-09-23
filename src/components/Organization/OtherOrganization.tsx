import { UserOrganization } from "../../db/user"
import { OrganizationMember } from "../../db/organization"
import OrganizationMembers from "./OrganizationMembers"
import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import FollowedBrands from "./Brand/FollowedBrands"

const OtherOrganization = ({
  organization,
  isAdmin,
  members,
  brands,
}: {
  organization: UserOrganization
  isAdmin: boolean
  members: OrganizationMember[]
  brands: { id: string; name: string }[]
}) => {
  return (
    <div data-testid='other-organization'>
      <Tabs
        tabs={[
          {
            label: "Marques",
            content: (
              <>
                <h2>Marques suivies</h2>
                <FollowedBrands organization={organization} brands={brands} />
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
        ].filter((tab) => tab !== undefined)}
      />
    </div>
  )
}

export default OtherOrganization
