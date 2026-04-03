import Table from "@codegouvfr/react-dsfr/Table"
import { AdminStats } from "../../services/stats/stats"
import Link from "next/link"
import { formatDateTime } from "../../services/format"
import styles from "./StatsTable.module.css"

const StatsTable = ({ stats }: { stats: NonNullable<AdminStats> }) => {
  return (
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
          <Link className={styles.link} href={`/marques/${info.brandId}`} key={info.name}>
            {info.name} <span className='fr-icon-arrow-right-line' aria-hidden='true' />
          </Link>,
          <Link className={styles.link} href={`/organisations/${info.organizationId}`} key={info.name}>
            {info.organization} <span className='fr-icon-arrow-right-line' aria-hidden='true' />
          </Link>,
          info.totalProducts,
          info.firstDepositDate ? formatDateTime(info.firstDepositDate) : "",
          info.lastDepositDate ? formatDateTime(info.lastDepositDate) : "",
        ])}
    />
  )
}

export default StatsTable
