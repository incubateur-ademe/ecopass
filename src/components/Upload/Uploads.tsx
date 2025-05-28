"use server"

import { Pagination } from "@codegouvfr/react-dsfr/Pagination"
import { auth } from "../../services/auth/auth"
import { getUploadsByUserId, getuploadsCountByUserId } from "../../db/upload"
import Download from "./Download"
import { Status } from "../../../prisma/src/prisma"
import { formatDateTime } from "../../services/format"
import Table from "../Table/Table"

const statusTitle: Record<Status, string> = {
  [Status.Done]: "Déclaration validée",
  [Status.Error]: "À corriger",
  [Status.Pending]: "Analyse en cours",
  [Status.Processing]: "Analyse en cours",
}

const Uploads = async ({ page }: { page: number }) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }
  const count = await getuploadsCountByUserId(session.user.id)
  const uploads = await getUploadsByUserId(session.user.id, page - 1)

  return uploads.length === 0 ? (
    <p>Aucun fichier pour le moment</p>
  ) : (
    <>
      <Table
        fixed
        caption='Mes fichiers'
        noCaption
        headers={["Date de dépot", "Nom du fichier", "Statut", "Nombre de produits validés", "Résultat"]}
        data={uploads.map((upload) => [
          formatDateTime(upload.createdAt),
          upload.name,
          upload.status === Status.Pending
            ? `${statusTitle[upload.status]} (${upload.done}/${upload.total})`
            : statusTitle[upload.status],
          (upload.status === Status.Error || upload.status === Status.Done) && upload.total > 0
            ? `${upload.success}/${upload.total}`
            : "",
          <Download
            uploadId={upload.id}
            key={`download-${upload.id}`}
            disabled={upload.status !== Status.Done && upload.status !== Status.Error}
          />,
        ])}
      />
      {count > 10 && (
        <Pagination
          count={Math.ceil(count / 10)}
          defaultPage={page}
          getPageLinkProps={(page) => ({
            href: `/declarations?page=${page}`,
          })}
          showFirstLast
        />
      )}
    </>
  )
}

export default Uploads
