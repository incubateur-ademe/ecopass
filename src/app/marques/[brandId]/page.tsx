import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { notFound } from "next/navigation"
import { getBrandWithProducts, getBrandById } from "../../../db/brands"
import BrandDetail from "../../../views/BrandDetail"
import { Metadata } from "next"
import { countPublicProductsByBrandId, getPublicProductsByBrandId } from "../../../db/product"
import { tryAndGetSession } from "../../../services/auth/redirect"
import { UserRole } from "@prisma/enums"

type Props = {
  params: Promise<{ brandId: string }>
  searchParams: Promise<{ page?: string; category?: string; organization?: string; from?: string; to?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandId } = await params
  const brandData = await getBrandById(brandId)

  if (!brandData) {
    return {
      title: "Marque - Affichage environnemental",
    }
  }

  return {
    title: `${brandData.name} - Affichage environnemental`,
  }
}

const BrandPage = async ({ params, searchParams }: Props) => {
  const session = await tryAndGetSession(false, false)
  const { brandId } = await params
  const { page, category, organization, from, to } = await searchParams
  const currentPage = parseInt(page || "1", 10)

  const validCategory = category ? (category as string) : undefined
  const validOrganization = organization ? (organization as string) : undefined
  let validFrom = from ? new Date(from as string) : undefined
  validFrom = Number.isNaN(validFrom?.getTime()) ? undefined : validFrom
  let validTo = to ? new Date(to as string) : undefined
  validTo = Number.isNaN(validTo?.getTime()) ? undefined : validTo

  const brandData = await getBrandWithProducts(brandId)
  if (!brandData) {
    return notFound()
  }

  const products = await getPublicProductsByBrandId(
    brandId,
    validCategory,
    validOrganization,
    validFrom,
    validTo,
    currentPage,
  )
  const filterCount =
    category || organization || from || to
      ? await countPublicProductsByBrandId(brandId, validCategory, validOrganization, validFrom, validTo)
      : brandData.productsByCategory.reduce((acc, current) => acc + current.count, 0)
  const isDGCCRF = session?.user.role === UserRole.DGCCRF
  console.log("Products:", products)
  return (
    <>
      <StartDsfrOnHydration />
      <BrandDetail
        filter={{
          category: validCategory,
          organization: validOrganization,
          from: validFrom ? from : undefined,
          to: validTo ? to : undefined,
        }}
        brand={brandData}
        filterCount={filterCount}
        products={products}
        currentPage={currentPage}
        isDGCCRF={isDGCCRF}
        breadCrumbs={{
          currentPageLabel: brandData.name,
          segments: isDGCCRF
            ? [
                { linkProps: { href: "/" }, label: "Accueil" },
                {
                  linkProps: { href: `/organisations/${brandData.organization.id}` },
                  label: `Organisation - ${brandData.organization.displayName}`,
                },
              ]
            : [
                { linkProps: { href: "/" }, label: "Accueil" },
                { linkProps: { href: "/marques" }, label: "Marques" },
              ],
        }}
      />
    </>
  )
}

export default BrandPage
