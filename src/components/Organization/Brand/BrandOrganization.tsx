import { UserOrganization } from "../../../db/user"
import MyBrands from "./MyBrands"
import MyDelegations from "../Delegation/MyDelegations"

const BrandOrganization = ({ organization }: { organization: UserOrganization }) => {
  return (
    <div data-testid='brand-organization'>
      <h2>Marques déclarées</h2>
      <MyBrands organization={organization} />
      <h2>Délégations</h2>
      <MyDelegations organization={organization} />
    </div>
  )
}

export default BrandOrganization
