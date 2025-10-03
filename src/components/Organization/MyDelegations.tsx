import { UserOrganization } from "../../db/user"
import Delegations from "./Delegations"
import NewDelegation from "./NewDelegation"

const MyDelegations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      <NewDelegation />
      <h3>Organisations à qui j'ai délégué des droits de déclaration</h3>
      {organization.authorizedOrganizations.length === 0 ? (
        <p className='fr-mt-2w fr-mb-5w'>Vous n'avez pas délégué de droits de déclaration.</p>
      ) : (
        <Delegations organizations={organization.authorizedOrganizations} type='to' />
      )}
    </>
  )
}

export default MyDelegations
