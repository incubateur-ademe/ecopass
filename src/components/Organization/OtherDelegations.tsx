import { UserOrganization } from "../../db/user"
import Delegations from "./Delegations"

const OtherDelegations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      <h3>Organisations qui m'ont délégué des droits de déclaration</h3>
      {organization.authorizedBy.length === 0 ? (
        <p className='fr-mt-2w fr-mb-5w'>Vous n'avez pas reçu de délégations de droits de déclaration.</p>
      ) : (
        <Delegations organizations={organization.authorizedBy} type='from' />
      )}
    </>
  )
}

export default OtherDelegations
