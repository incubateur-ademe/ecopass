"use client"

import { AdminStats } from "../../services/stats/stats"
import Link from "next/link"
import { formatDateTime } from "../../services/format"
import styles from "./StatsTable.module.css"
import Table from "../Table/Table"
import { useState, useMemo } from "react"
import Input from "@codegouvfr/react-dsfr/Input"
import Fuse from "fuse.js"

const StatsTable = ({ stats }: { stats: AdminStats }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const fuse = useMemo(
    () =>
      new Fuse(stats, {
        keys: ["organizationName", "brandName", "declarant"],
        threshold: 0.3,
        minMatchCharLength: 1,
      }),
    [stats],
  )

  const filteredStats = useMemo(() => {
    if (!searchQuery) return stats
    return fuse.search(searchQuery).map((result) => result.item)
  }, [stats, searchQuery, fuse])

  return (
    <>
      <p className={styles.statsCount}>{new Set(stats.map((info) => info.brandId)).size} marques déclarées</p>
      <Input
        label='Rechercher'
        nativeInputProps={{
          type: "text",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: "Organisation, marque ou déclarant...",
        }}
      />
      <Table
        fixed
        caption='Statistiques'
        noCaption
        headers={["Organisation", "Marque", "Déclarant", "Produits", "Premier upload", "Dernier upload"]}
        data={filteredStats
          .sort((a, b) => {
            if (b.lastDepositDate && a.lastDepositDate) {
              return b.lastDepositDate.getTime() - a.lastDepositDate.getTime()
            } else if (b.lastDepositDate) {
              return 1
            } else if (a.lastDepositDate) {
              return -1
            } else {
              return a.brandName.localeCompare(b.brandName)
            }
          })
          .map((info) => {
            const key = `${info.brandId}-${info.organizationId}-${info.declarant}`
            return [
              info.organizationId && info.organizationName ? (
                <Link className={styles.link} href={`/organisations/${info.organizationId}`} key={key}>
                  {info.organizationName} <span className='fr-icon-arrow-right-line' aria-hidden='true' />
                </Link>
              ) : (
                "(non connu)"
              ),
              <Link className={styles.link} href={`/marques/${info.brandId}`} key={key}>
                {info.brandName} <span className='fr-icon-arrow-right-line' aria-hidden='true' />
              </Link>,
              info.declarant,
              info.totalProducts,
              info.firstDepositDate ? formatDateTime(info.firstDepositDate) : "",
              info.lastDepositDate ? formatDateTime(info.lastDepositDate) : "",
            ]
          })}
      />
    </>
  )
}

export default StatsTable
