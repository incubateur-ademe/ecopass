import { Metadata } from "next"
import { redirect } from "next/navigation"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { UserRole } from "@prisma/enums"
import { tryAndGetSession } from "../../../services/auth/redirect"
import DGCCRFStats from "../../../views/DGCCRFStats"
import { getMetabaseToken } from "../../../serverFunctions/metabase"

export const metadata: Metadata = {
  title: "Ordres de grandeur - Affichage environnemental",
}

const DGCCRFStatsPage = async () => {
  const session = await tryAndGetSession(true, false)
  if (session.user.role !== UserRole.DGCCRF && session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const token = getMetabaseToken(53)
  return (
    <>
      <StartDsfrOnHydration />
      <DGCCRFStats token={token} />
    </>
  )
}

export default DGCCRFStatsPage
