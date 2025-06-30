import { UserOrganization } from "../../db/user"
import NewDelegation from "./NewDelegation"

const MyDelegations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      {organization.authorizedOrganizations.length === 0 ? (
        <p>Vous n'avez pas déléguer de droits de déclaration.</p>
      ) : (
        <>{organization.brands.map(({ name }) => name)}</>
      )}
      <NewDelegation />
    </>
  )
}

export default MyDelegations
