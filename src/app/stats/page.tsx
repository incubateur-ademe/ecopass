import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Statistics from "../../views/Statistics"
import { getProductCount } from "../../db/product"
import { getMetabaseToken } from "../../serverFunctions/metabase"

export const metadata: Metadata = {
  title: "Statistiques - Affichage environnemental",
}

export default async function StatsPage() {
  const total = await getProductCount()

  const tokens = [getMetabaseToken("dashboard", 5), getMetabaseToken("dashboard", 6), getMetabaseToken("dashboard", 7)]
  return (
    <>
      <StartDsfrOnHydration />
      <Statistics
        total={total}
        tokens={{
          general: { type: "dashboard", token: tokens[0] },
          brands: { type: "dashboard", token: tokens[1] },
          products: { type: "dashboard", token: tokens[2] },
        }}
      />
    </>
  )
}
