import Block from "../components/Block/Block"
import Table from "../components/Table/Table"
import { AdminStats } from "../services/stats/stats"
import { formatDateTime } from "../services/format"

const Admin = ({ stats }: { stats: AdminStats }) => {
  return (
    <Block>
      <h1>Admin Dashboard</h1>
      {stats && (
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
                return a.organizationName.localeCompare(b.organizationName)
              }
            })
            .map((info) => [
              info.organizationName,
              info.userCount,
              info.uploadDates.first ? formatDateTime(info.uploadDates.first) : "",
              info.uploadDates.last ? formatDateTime(info.uploadDates.last) : "",
              info.totalProducts,
              `${info.uploads.file} (${info.uploads.fileDone} réussi${info.uploads.fileDone > 1 ? "s" : ""})`,
              `${info.uploads.api} (${info.uploads.apiDone} réussi${info.uploads.apiDone > 1 ? "s" : ""})`,
              Object.keys(info.brandCounts).length > 0 ? (
                <ul key={info.organizationName}>
                  {Object.entries(info.brandCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => (
                      <li key={name}>
                        {name} : <b>{count}</b>
                      </li>
                    ))}
                </ul>
              ) : (
                ""
              ),
            ])}
        />
      )}
    </Block>
  )
}

export default Admin
