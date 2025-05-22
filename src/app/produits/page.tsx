import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Products from "../../views/Products"

const ProductsPage = () => {
  return (
    <>
      <StartDsfrOnHydration />
      <Products />
    </>
  )
}

export default ProductsPage
