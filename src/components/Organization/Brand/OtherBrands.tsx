import Alert from "@codegouvfr/react-dsfr/Alert"
import { UserOrganization } from "../../../db/user"
import Brands from "./Brands"

const OtherBrands = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      {organization.authorizedBy.length === 0 ? (
        <Alert
          severity='info'
          small
          description="Vous n'avez pas encore de marques en délégation."
          className='fr-mb-4w'
        />
      ) : (
        <Brands
          delegated
          brands={organization.authorizedBy.flatMap((organization) =>
            organization.from.brands.map((brand) => ({ ...brand, organization: organization.from.name })),
          )}
        />
      )}
    </>
  )
}

export default OtherBrands
