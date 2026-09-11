"use server"
import { auth } from "../../../services/auth/auth"
import { getExportsByUserIdAndBrand } from "../../../db/export"
import ExportsTable from "./ExportsTable"
import { ExportType } from "@prisma/enums"

const Exports = async ({ brand, type }: { brand?: string; type: ExportType }) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const exports = await getExportsByUserIdAndBrand(session.user.id, brand, type)

  return exports.length > 0 && <ExportsTable exports={exports} />
}

export default Exports
