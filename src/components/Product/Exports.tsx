"use server"
import { auth } from "../../services/auth/auth"
import { getExportsByUserId } from "../../db/export"
import ExportsTable from "./ExportsTable"

const Exports = async () => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const exports = await getExportsByUserId(session.user.id)

  return exports.length > 0 && <ExportsTable exports={exports} />
}

export default Exports
