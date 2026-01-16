import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { notFound } from "next/navigation"
import { getBrandWithProducts } from "../../../db/brands"
import BrandDetail from "../../../views/BrandDetail"
import { Metadata } from "next"

type Props = {
  params: Promise<{ brandId: string }>
}

export const metadata: Metadata = {
  title: "Marques - Affichage environnemental",
}

const BrandPage = async ({ params }: Props) => {
  console.log("[MEMORY][marques/[brandId]/page][start]", process.memoryUsage())
  const { brandId } = await params
  const brandData = await getBrandWithProducts(brandId)
  let result
  if (!brandData) {
    console.log("[MEMORY][marques/[brandId]/page][end]", process.memoryUsage())
    notFound()
  } else {
    result = (
      <>
        <StartDsfrOnHydration />
        {brandData && <BrandDetail brand={brandData.brand} products={brandData.products} />}
      </>
    )
    console.log("[MEMORY][marques/[brandId]/page][end]", process.memoryUsage())
    return result
  }
}

export default BrandPage
