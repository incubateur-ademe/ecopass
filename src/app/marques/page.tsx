import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { getAllBrandsWithStats } from "../../db/brands"
import Brands from "../../views/Brands"
import { PageProps } from "../../types/Next"
import { tryAndGetSession } from "../../services/auth/redirect"
import { canViewAsDgccrf } from "../../utils/authorization/authorizations"

export const metadata: Metadata = {
  title: "Marques - Affichage environnemental",
}

const BrandsPage = async ({ searchParams }: PageProps) => {
  const session = await tryAndGetSession(false, false)
  const role = session?.user?.role
  const brands = await getAllBrandsWithStats()
  const params = await searchParams
  const page = params.page ? parseInt(params.page as string, 10) : 1
  const search = params.search ? (params.search as string) : ""
  const isDGCCRF = canViewAsDgccrf(role)

  return (
    <>
      <StartDsfrOnHydration />
      <Brands brands={brands} defaultSearch={search} defaultPage={page} isDGCCRF={isDGCCRF} />
    </>
  )
}

export default BrandsPage
