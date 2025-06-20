"use server"
import { auth } from "../../services/auth/auth"
import { getExportsByUserIdAndBrand } from "../../db/export"
import ExportsTable from "./ExportsTable"

const Exports = async ({ brand }: { brand?: string }) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const exports = await getExportsByUserIdAndBrand(session.user.id, brand)

  return exports.length > 0 && <ExportsTable exports={exports} />
}

export default Exports
