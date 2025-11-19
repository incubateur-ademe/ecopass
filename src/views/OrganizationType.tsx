import Block from "../components/Block/Block"
import OrganizationTypeBanner from "../components/Home/OrganizationTypeBanner"
import { UserOrganization } from "../db/user"

const OrganizationType = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      <Block large secondary>
        <OrganizationTypeBanner organization={organization} />
      </Block>
    </>
  )
}

export default OrganizationType
