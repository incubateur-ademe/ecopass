import MyOrganization from "../components/Organization/MyOrganization"
import { OrganizationMember } from "../db/organization"
import { UserOrganization } from "../db/user"

const Organization = ({
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
  return <MyOrganization organization={organization} isAdmin={isAdmin} members={members} brands={brands} />
}

export default Organization
