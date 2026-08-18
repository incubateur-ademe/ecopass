import MyOrganization from "../components/Organization/MyOrganization"
import { OrganizationMember } from "../db/organization"
import { UserOrganization } from "../db/user"

const Organization = ({
  organization,
  isAdmin,
  members,
}: {
  organization: UserOrganization
  isAdmin: boolean
  members: OrganizationMember[]
}) => {
  return <MyOrganization organization={organization} isAdmin={isAdmin} members={members} />
}

export default Organization
