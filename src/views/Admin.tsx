import Block from "../components/Block/Block"
import { formatDateTime } from "../services/format"
import { AdminStats } from "../services/stats/stats"

const Admin = ({ stats }: { stats: AdminStats }) => {
  return (
    <Block>
      <h1>Admin Dashboard</h1>
      <ul>
        {stats &&
          stats
            .sort((a, b) => {
              if (b.uploadDates.last && a.uploadDates.last) {
                return b.uploadDates.last.getTime() - a.uploadDates.last.getTime()
              } else if (b.uploadDates.last) {
                return 1
              } else if (a.uploadDates.last) {
                return -1
              } else {
                return b.organizationName.localeCompare(a.organizationName)
              }
            })
            .map((info) => (
              <li key={info.organizationName}>
                <strong>{info.organizationName}</strong> :
                <ul>
                  <li>
                    <b>{info.userCount}</b> utilisateur{info.userCount > 1 ? "s" : ""}
                  </li>
                  {info.uploadDates.first && info.uploadDates.last && (
                    <>
                      <li>
                        première déclaration le : <b>{formatDateTime(info.uploadDates.first)}</b>
                      </li>
                      <li>
                        dernière déclaration le : <b>{formatDateTime(info.uploadDates.last)}</b>
                      </li>
                    </>
                  )}
                  <li>
                    <b>{info.totalProducts}</b> produit{info.totalProducts > 1 ? "s" : ""}
                  </li>
                  <li>
                    <b>{info.uploads.file}</b> fichier{info.uploads.file > 1 ? "s" : ""} uploadé
                    {info.uploads.file > 1 ? "s" : ""} (<b>{info.uploads.fileDone}</b> réussi
                    {info.uploads.fileDone > 1 ? "s" : ""})
                  </li>
                  <li>
                    <b>{info.uploads.api}</b> déclaration{info.uploads.api > 1 ? "s" : ""} API (
                    <b>{info.uploads.apiDone}</b> réussie{info.uploads.apiDone > 1 ? "s" : ""})
                  </li>
                  <li>
                    <b>Marques :</b>
                    <ul>
                      {Object.entries(info.brandCounts)
                        .sort((a, b) => b[1] - a[1])
                        .map(([name, count]) => (
                          <li key={name}>
                            {name} : <b>{count}</b> produit{count > 1 ? "s" : ""}
                          </li>
                        ))}
                    </ul>
                  </li>
                </ul>
              </li>
            ))}
      </ul>
    </Block>
  )
}

export default Admin
