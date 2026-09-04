"use client"
import Table from "../Table/Table"
import { Export } from "@prisma/client"
import { Status } from "@prisma/enums"
import DownloadExport from "./DownloadExport"
import { formatDateTime } from "../../services/format"
import { useState } from "react"
import Alert from "@codegouvfr/react-dsfr/Alert"
import StatusBadge from "./StatusBadge"

const ExportsTable = ({ exports }: { exports: Export[] }) => {
  const [error, setError] = useState<boolean>(false)
  return (
    <>
      {error && (
        <Alert
          severity='error'
          title='Erreur lors du téléchargement'
          description='Veuillez réessayer, si le problème persiste, merci de nous contacter.'
          className='fr-mt-2w'
        />
      )}
      <Table
        fixed
        caption='Mes produits'
        noCaption
        headers={["Date", "Status", "Fichier", "Nom", ""]}
        data={exports.flatMap((item) =>
          item.count
            ? Array.from({ length: item.count }).map((_, index) => [
                formatDateTime(item.createdAt),
                <StatusBadge status={item.status} key={`${item.id}-${index}`} />,
                `${index + 1} / ${item.count}`,
                `${item.name} - Partie ${index + 1}`,
                item.status == Status.Done ? (
                  <DownloadExport name={item.name} key={`${item.id}-${index}`} setError={setError} index={index} />
                ) : (
                  ""
                ),
              ])
            : [
                [
                  formatDateTime(item.createdAt),
                  <StatusBadge status={item.status} key={item.id} />,
                  item.status == Status.Done ? "1 / 1" : "",
                  item.name,
                  item.status == Status.Done ? (
                    <DownloadExport name={item.name} key={item.id} setError={setError} />
                  ) : (
                    ""
                  ),
                ],
              ],
        )}
      />
    </>
  )
}

export default ExportsTable
