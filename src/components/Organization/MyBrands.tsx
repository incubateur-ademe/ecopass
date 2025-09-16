import { UserOrganization } from "../../db/user"
import Brands from "./Brands"
import NewBrand from "./NewBrand"

const MyBrands = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      {organization.brands.length === 0 ? (
        <>
          <p>Vous n'avez pas encore déclaré de marques.</p>
          <p>Tout vos produits apparaitront sur le nom de votre organisation ({organization.name}).</p>
        </>
      ) : (
        <>
          <p>
            Vous pouvez déclarer vos produits soit sous le nom de votre organsation ({organization.name}), soit sous un
            des noms ci dessous.
          </p>
          <Brands brands={organization.brands} />
        </>
      )}
      <NewBrand />
    </>
  )
}

export default MyBrands
