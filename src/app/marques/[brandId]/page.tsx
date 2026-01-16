import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { notFound } from "next/navigation"
import { getBrandWithProducts, getBrandById } from "../../../db/brands"
import BrandDetail from "../../../views/BrandDetail"
import { Metadata } from "next"
import { getPublicProductsByBrandId } from "../../../db/product"

type Props = {
  params: Promise<{ brandId: string }>
  searchParams: Promise<{ page?: string }>
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
  console.log("[MEMORY][marques/[brandId]/page][start]", process.memoryUsage())
  const { brandId } = await params
  const { page } = await searchParams
  const currentPage = parseInt(page || "1", 10)

  const brandData = await getBrandWithProducts(brandId)
  if (!brandData) {
    console.log("[MEMORY][marques/[brandId]/page][end]", process.memoryUsage())
    return notFound()
  }

  const products = await getPublicProductsByBrandId(brandId, currentPage)
  const result = (
    <>
      <StartDsfrOnHydration />
      <BrandDetail brand={brandData} products={products} currentPage={currentPage} />
    </>
  )
  console.log("[MEMORY][marques/[brandId]/page][end]", process.memoryUsage())
  return result
}

export default BrandPage
