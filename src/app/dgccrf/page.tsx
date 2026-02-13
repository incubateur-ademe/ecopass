import { Metadata } from "next"
import { redirect } from "next/navigation"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { UserRole } from "@prisma/enums"
import { tryAndGetSession } from "../../services/auth/redirect"
import { getAllBrands } from "../../db/product"
import DgccrfExport from "../../views/DgccrfExport"

export const metadata: Metadata = {
  title: "DGCCRF - Affichage environnemental",
}

const DgccrfPage = async () => {
  const session = await tryAndGetSession(true, false)
  if (session.user.role !== UserRole.DGCCRF) {
    redirect("/")
  }

  const brands = await getAllBrands()

  return (
    <>
      <StartDsfrOnHydration />
      <DgccrfExport brands={brands} />
    </>
  )
}

export default DgccrfPage
