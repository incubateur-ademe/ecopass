import { UserOrganization } from "../../../db/user"
import Delegations from "./Delegations"
import NewDelegation from "./NewDelegation"

const MyDelegations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      <NewDelegation />
      {organization.authorizedOrganizations.length > 0 && (
        <Delegations organizations={organization.authorizedOrganizations} type='to' />
      )}
    </>
  )
}

export default MyDelegations
