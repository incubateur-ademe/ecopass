import { UserBrand } from "../../db/user"
import Brands from "./Brands"
import NewBrand from "./NewBrand"

const MyBrands = ({ brand }: { brand: UserBrand }) => {
  return (
    <>
      {brand.names.length === 0 ? (
        <>
          <p>Vous n'avez pas encore déclarer de marques.</p>
          <p>Tout vos produits apparaitront sur le nom de votre organisation ({brand.name})</p>
        </>
      ) : (
        <>
          <p>
            Vous pouvez déclarer vos produits soit sous le nom de votre organsation ({brand.name}), soit sous un des
            noms ci dessous.
          </p>
          <Brands brands={brand.names} />
        </>
      )}
      <NewBrand />
    </>
  )
}

export default MyBrands
