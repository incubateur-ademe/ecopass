import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBrandById, getBrandWithProducts } from "../../../db/brands"
import BrandDetail from "../../../views/BrandDetail"

type Props = {
  params: Promise<{ brandId: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { brandId } = await params
  const brand = await getBrandById(brandId)

  if (!brand) {
    return { title: "Marque introuvable - Affichage environnemental" }
  }

  return { title: `${brand.name} - Affichage environnemental` }
}

const BrandPage = async ({ params }: Props) => {
  const { brandId } = await params
  const brandData = await getBrandWithProducts(brandId)

  if (!brandData) {
    notFound()
  }

  return (
    <>
      <StartDsfrOnHydration />
      {brandData && <BrandDetail brand={brandData.brand} products={brandData.products} />}
    </>
  )
}

export default BrandPage
