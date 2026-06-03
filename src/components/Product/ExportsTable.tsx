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
        headers={["Date", "Status", "Nom", ""]}
        data={exports.map((item) => [
          formatDateTime(item.createdAt),
          <StatusBadge status={item.status} key={item.id} />,
          item.name,
          item.status == Status.Done ? <DownloadExport name={item.name} key={item.id} setError={setError} /> : "",
        ])}
      />
    </>
  )
}

export default ExportsTable
