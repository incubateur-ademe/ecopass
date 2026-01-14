import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { getAllBrandsWithStats } from "../../db/brands"
import Brands from "../../views/Brands"

export const metadata: Metadata = {
  title: "Marques - Affichage environnemental",
}

const BrandsPage = async () => {
  const brands = await getAllBrandsWithStats()

  return (
    <>
      <StartDsfrOnHydration />
      <Brands brands={brands} />
    </>
  )
}

export default BrandsPage
