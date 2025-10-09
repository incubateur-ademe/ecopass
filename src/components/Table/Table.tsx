"use client"

import { TableProps } from "@codegouvfr/react-dsfr/Table"
import dynamic from "next/dynamic"
import styles from "./Table.module.css"

const TableDSFR = dynamic(() => import("@codegouvfr/react-dsfr/Table"), {
  ssr: false,
})

const Table = (props: TableProps) => {
  return (
    <div className={styles.table}>
      <TableDSFR {...props} />
    </div>
  )
}

export default Table
