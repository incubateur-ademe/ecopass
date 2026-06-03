import { UserOrganization } from "../../../db/user"
import MyBrands from "./MyBrands"
import NewDelegation from "../Delegation/NewDelegation"
import Delegations from "../Delegation/Delegations"
import NewDelegationModal from "../Delegation/NewDelegationModal"

const BrandOrganization = ({ organization }: { organization: UserOrganization }) => {
  return (
    <div data-testid='brand-organization'>
      <h2>Marques déclarées</h2>
      <MyBrands organization={organization} />
      {organization.authorizedOrganizations.length === 0 ? (
        <NewDelegation />
      ) : (
        <>
          <h2>Délégations</h2>
          <Delegations organizations={organization.authorizedOrganizations} type='to' />
          <NewDelegationModal />
        </>
      )}
    </div>
  )
}

export default BrandOrganization
