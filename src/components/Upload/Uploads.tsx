"use server"

import { auth } from "../../services/auth/auth"
import { getUploadsByUserId } from "../../db/upload"
import Download from "./Download"
import { Status } from "../../../prisma/src/prisma"
import { formatDate } from "../../services/format"
import Table from "../Table/Table"

const statusTitle: Record<Status, string> = {
  [Status.Done]: "Déclaration validée",
  [Status.Error]: "À corriger",
  [Status.Pending]: "Analyse en cours",
  [Status.Processing]: "Analyse en cours",
}

const Uploads = async () => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }
  const uploads = await getUploadsByUserId(session.user.id)
  return uploads.length === 0 ? (
    <p>Aucun fichier pour le moment</p>
  ) : (
    <Table
      caption='Mes fichiers'
      noCaption
      headers={["Date", "Nom", "Statut", "Résultat"]}
      data={uploads.map((upload) => [
        formatDate(upload.createdAt),
        upload.name,
        upload.status === Status.Pending
          ? `${statusTitle[upload.status]} (${upload.done}/${upload.total})`
          : statusTitle[upload.status],
        <Download
          uploadId={upload.id}
          key={`download-${upload.id}`}
          disabled={upload.status !== Status.Done && upload.status !== Status.Error}
        />,
      ])}
    />
  )
}

export default Uploads
