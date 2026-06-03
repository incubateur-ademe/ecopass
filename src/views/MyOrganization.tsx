import MyOrganization from "../components/Organization/MyOrganization"
import { UserOrganization } from "../db/user"

const Organization = ({ organization }: { organization: UserOrganization }) => {
  return <MyOrganization organization={organization} />
}

export default Organization
