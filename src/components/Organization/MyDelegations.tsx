import { UserBrand } from "../../db/user"
import NewDelegation from "./NewDelegation"

const MyDelegations = ({ brand }: { brand: UserBrand }) => {
  return (
    <>
      {brand.authorizedBrands.length === 0 ? (
        <p>Vous n'avez pas déléguer de droits de déclaration.</p>
      ) : (
        <>{brand.names.map(({ name }) => name)}</>
      )}
      <NewDelegation />
    </>
  )
}

export default MyDelegations
