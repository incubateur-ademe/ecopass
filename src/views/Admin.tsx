import Block from "../components/Block/Block"
import { AdminStats } from "../services/stats/stats"
import StatsTable from "../components/Admin/StatsTable"

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
          <StatsTable stats={stats} />
        </>
      )}
    </Block>
  )
}

export default Admin
