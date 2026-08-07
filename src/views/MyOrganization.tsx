import MyOrganization from "../components/Organization/MyOrganization"
import { OrganizationMember } from "../db/organization"
import { UserOrganization } from "../db/user"

const Organization = ({
  organization,
  canEditMembers,
  members,
}: {
  organization: UserOrganization
  canEditMembers: boolean
  members: OrganizationMember[]
}) => {
  return <MyOrganization organization={organization} canEditMembers={canEditMembers} members={members} />
}

export default Organization
