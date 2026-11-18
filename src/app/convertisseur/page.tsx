import { Metadata } from "next"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Converter from "../../views/Converter"
import { getProductWithScore } from "../../db/product"
import { PageProps } from "../../types/Next"

export const metadata: Metadata = {
  title: "Convertisseur d'impacts - Affichage environnemental",
}

const ConverterPage = async (props: PageProps) => {
  const searchParams = await props.searchParams
  const gtin = typeof searchParams.gtin === "string" ? searchParams.gtin : undefined
  const product = gtin ? await getProductWithScore(gtin) : null
  return (
    <>
      <StartDsfrOnHydration />
      <Converter product={product} gtin={gtin} />
    </>
  )
}

export default ConverterPage
