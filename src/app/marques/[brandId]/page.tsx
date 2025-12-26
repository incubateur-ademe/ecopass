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
