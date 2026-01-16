import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { getAllBrandsWithStats } from "../../db/brands"
import Brands from "../../views/Brands"

export const metadata: Metadata = {
  title: "Marques - Affichage environnemental",
}

const BrandsPage = async () => {
  console.log("[MEMORY][marques/page][start]", process.memoryUsage())
  const brands = await getAllBrandsWithStats()
  const result = (
    <>
      <StartDsfrOnHydration />
      <Brands brands={brands} />
    </>
  )
  console.log("[MEMORY][marques/page][end]", process.memoryUsage())
  return result
}

export default BrandsPage
