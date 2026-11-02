import Block from "../components/Block/Block"
import { AdminStats } from "../services/stats/stats"
import StatsTable from "../components/Admin/StatsTable"
import Metabase from "../components/Stats/Metabase"
import styles from "./Admin.module.css"

const Admin = ({ stats, token }: { stats: AdminStats | null; token?: string }) => {
  return (
    <>
      <Block>
        <h1>Statistiques admin</h1>
        <div className={styles.metabase}>
          <Metabase token={token} type='dashboard' />
        </div>
      </Block>
      {stats && (
        <Block>
          <h2>Explorer les données produits</h2>
          <StatsTable stats={stats} />
        </Block>
      )}
    </>
  )
}

export default Admin
