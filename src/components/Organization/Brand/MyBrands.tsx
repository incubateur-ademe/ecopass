import { UserOrganization } from "../../../db/user"
import Brands from "./Brands"
import NewBrand from "./NewBrand"

const MyBrands = ({ organization, isAdmin }: { organization: UserOrganization; isAdmin: boolean }) => {
  return (
    <>
      {isAdmin && (
        <div className='fr-mt-4w'>
          <NewBrand />
        </div>
      )}
      <div className='fr-mt-4w'>
        <Brands brands={organization.brands} />
      </div>
    </>
  )
}

export default MyBrands
