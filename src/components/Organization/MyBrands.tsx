import Alert from "@codegouvfr/react-dsfr/Alert"
import { UserOrganization } from "../../db/user"
import Brands from "./Brands"
import NewBrand from "./NewBrand"

const MyBrands = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      {organization.brands.length === 0 ? (
        <Alert
          severity='info'
          title="Vous n'avez pas déclaré de marques"
          description={`Tous vos produits apparaîtront sous le nom de votre organisation (${organization.name}).`}
        />
      ) : (
        <Alert
          severity='info'
          small
          description={`Tous vos produits apparaîtront sous le nom de votre organisation (${organization.name}).`}
        />
      )}
      <div className='fr-mt-4w'>
        <NewBrand />
      </div>
      <div className='fr-mt-4w'>
        <Brands brands={[{ name: organization.name, id: "todo" }, ...organization.brands]} />
      </div>
    </>
  )
}

export default MyBrands
