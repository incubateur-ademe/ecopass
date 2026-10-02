"use client"
import Table from "../../Table/Table"
import { Export } from "@prisma/client"
import { ExportType, Status } from "@prisma/enums"
import DownloadExport from "../DownloadExport"
import { formatDateTime } from "../../../services/format"
import { useState } from "react"
import Alert from "@codegouvfr/react-dsfr/Alert"
import StatusBadge from "../StatusBadge"

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
      <p>
        <b>Les Étiquettes .svg</b> : redirigent vers le détail du calcul du coût du produit, à intégrer à vos fiches
        produits en ligne et à imprimer sur vos étiquettes en magasin.
      </p>
      <p>
        <b>Les Scores .csv</b> : détaillent des données de calcul .csv et coefficient de durabilité
      </p>
      <Table
        fixed
        caption='Mes produits'
        noCaption
        headers={["Type d’export", "Statut", "Fichier", "Date", ""]}
        data={exports.flatMap((item) =>
          item.count && item.count > 1
            ? Array.from({ length: item.count }).map((_, index) => [
                item.type === ExportType.CSV ? "Fichier de données csv" : "Étiquettes svg",
                <StatusBadge status={item.status} key={`${item.id}-${index}`} />,
                `${index + 1} / ${item.count}`,
                formatDateTime(item.createdAt),
                item.status == Status.Done ? (
                  <DownloadExport
                    name={item.name}
                    key={`${item.id}-${index}`}
                    setError={setError}
                    index={index}
                    exportType={item.type}
                  />
                ) : (
                  ""
                ),
              ])
            : [
                [
                  item.type === ExportType.CSV ? "Fichier de données csv" : "Étiquettes svg",
                  <StatusBadge status={item.status} key={item.id} />,
                  item.status == Status.Done ? "1 / 1" : "",
                  formatDateTime(item.createdAt),
                  item.status == Status.Done ? (
                    <DownloadExport name={item.name} key={item.id} setError={setError} exportType={item.type} />
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
