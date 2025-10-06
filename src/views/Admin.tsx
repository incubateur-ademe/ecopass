import Block from "../components/Block/Block"
import Table from "../components/Table/Table"
import { AdminStats } from "../services/stats/stats"
import { formatDateTime } from "../services/format"
import { nafs } from "../utils/admin/nafs"

const Admin = ({ stats }: { stats: AdminStats }) => {
  return (
    <Block>
      <h1>Statistiques admin</h1>
      {stats && (
        <>
          <p>
            <b>{stats.reduce((acc, curr) => acc + curr.userCount, 0)}</b> utilisateurs dans <b>{stats.length}</b>{" "}
            organisations
          </p>
          <Table
            fixed
            caption='Statistiques'
            noCaption
            headers={[
              "Nom",
              "Utilisateurs",
              "Premier upload",
              "Dernier upload",
              "Produits",
              "Uploads fichier",
              "Uploads API",
              "Produits par marque",
            ]}
            data={stats
              .sort((a, b) => {
                if (b.uploadDates.last && a.uploadDates.last) {
                  return b.uploadDates.last.getTime() - a.uploadDates.last.getTime()
                } else if (b.uploadDates.last) {
                  return 1
                } else if (a.uploadDates.last) {
                  return -1
                } else {
                  return a.name.localeCompare(b.name)
                }
              })
              .map((info) => [
                <div key={info.name}>
                  <span>
                    {info.name} - {info.siret} {info.effectif !== "NN" && `(${info.effectif} salariés)`}
                  </span>

                  {info.naf !== null && (
                    <>
                      <br />
                      {nafs[info.naf] || info.naf}
                    </>
                  )}
                </div>,
                info.userCount,
                info.uploadDates.first ? formatDateTime(info.uploadDates.first) : "",
                info.uploadDates.last ? formatDateTime(info.uploadDates.last) : "",
                info.totalProducts,
                `${info.uploads.file} (${info.uploads.fileDone} réussi${info.uploads.fileDone > 1 ? "s" : ""})`,
                info.uploads.api,
                Object.keys(info.brandCounts).length > 0 ? (
                  <ul key={info.name}>
                    {Object.entries(info.brandCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, count]) => (
                        <li key={name}>
                          {name} : {count}
                        </li>
                      ))}
                  </ul>
                ) : (
                  ""
                ),
              ])}
          />
        </>
      )}
    </Block>
  )
}

export default Admin
