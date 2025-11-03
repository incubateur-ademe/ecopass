import Block from "../components/Block/Block"
import Table from "../components/Table/Table"
import { AdminStats } from "../services/stats/stats"
import { formatDateTime } from "../services/format"

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
            headers={["Marque", "Déclarant", "Produits", "Premier upload", "Dernier upload"]}
            data={stats
              .flatMap((info) => info.brands)
              .sort((a, b) => {
                if (b.lastDepositDate && a.lastDepositDate) {
                  return b.lastDepositDate.getTime() - a.lastDepositDate.getTime()
                } else if (b.lastDepositDate) {
                  return 1
                } else if (a.lastDepositDate) {
                  return -1
                } else {
                  return a.name.localeCompare(b.name)
                }
              })
              .map((info) => [
                info.name,
                info.organization,
                info.totalProducts,
                info.firstDepositDate ? formatDateTime(info.firstDepositDate) : "",
                info.lastDepositDate ? formatDateTime(info.lastDepositDate) : "",
              ])}
          />
        </>
      )}
    </Block>
  )
}

export default Admin
