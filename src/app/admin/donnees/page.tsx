import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/enums"
import { tryAndGetSession } from "../../../services/auth/redirect"
import AdminData from "../../../views/AdminData"
import { countPublicProductsByBrandId, getPublicProductsByBrandId } from "../../../db/product"

type Props = {
  searchParams: Promise<{ category?: string; organization?: string; from?: string; to?: string; page?: string }>
}

export const metadata: Metadata = {
  title: "Extraction des données - Affichage environnemental",
}

const AdminDataPage = async ({ searchParams }: Props) => {
  const session = await tryAndGetSession(true, true)
  if (session.user.role !== UserRole.ADMIN) {
    return redirect("/")
  }

  const { page, category, organization, from, to } = await searchParams
  const currentPage = parseInt(page || "1", 10)
  const validCategory = category ? (category as string) : undefined
  const validOrganization = organization ? (organization as string) : undefined
  let validFrom = from ? new Date(from as string) : undefined
  validFrom = Number.isNaN(validFrom?.getTime()) ? undefined : validFrom
  let validTo = to ? new Date(to as string) : undefined
  validTo = Number.isNaN(validTo?.getTime()) ? undefined : validTo

  const products = await getPublicProductsByBrandId(
    undefined,
    validCategory,
    validOrganization,
    validFrom,
    validTo,
    currentPage,
  )
  const productCount = await countPublicProductsByBrandId(
    undefined,
    validCategory,
    validOrganization,
    validFrom,
    validTo,
  )

  return (
    <>
      <StartDsfrOnHydration />
      <AdminData
        currentPage={currentPage}
        products={products}
        productCount={productCount}
        filter={{
          category: validCategory,
          organization: validOrganization,
          from: validFrom ? from : undefined,
          to: validTo ? to : undefined,
        }}
      />
    </>
  )
}

export default AdminDataPage
