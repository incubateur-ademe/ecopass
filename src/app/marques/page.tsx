import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { getAllBrandsWithStats } from "../../db/brands"
import Brands from "../../views/Brands"
import { PageProps } from "../../types/Next"

export const metadata: Metadata = {
  title: "Marques - Affichage environnemental",
}

const BrandsPage = async ({ searchParams }: PageProps) => {
  const brands = await getAllBrandsWithStats()
  const params = await searchParams
  const page = params.page ? parseInt(params.page as string, 10) : 1
  const search = params.search ? (params.search as string) : ""

  return (
    <>
      <StartDsfrOnHydration />
      <Brands brands={brands} defaultSearch={search} defaultPage={page} />
    </>
  )
}

export default BrandsPage
