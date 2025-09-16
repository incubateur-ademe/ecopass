import { UserOrganization } from "../../db/user"
import Delegations from "./Delegations"
import NewDelegation from "./NewDelegation"

const MyDelegations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      {organization.authorizedOrganizations.length === 0 ? (
        <p>Vous n'avez pas délégué de droits de déclaration.</p>
      ) : (
        <Delegations organizations={organization.authorizedOrganizations} />
      )}
      <NewDelegation />
    </>
  )
}

export default MyDelegations
