import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Products from "../../views/Products"

const ProductsPage = ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const page = searchParams?.page ? parseInt(searchParams.page as string, 10) : 1
  return (
    <>
      <StartDsfrOnHydration />
      <Products page={page} />
    </>
  )
}

export default ProductsPage
