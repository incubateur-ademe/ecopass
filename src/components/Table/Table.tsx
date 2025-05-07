"use client"

import { TableProps } from "@codegouvfr/react-dsfr/Table"
import dynamic from "next/dynamic"

const TableDSFR = dynamic(() => import("@codegouvfr/react-dsfr/Table"), {
  ssr: false,
})

const Table = (props: TableProps) => {
  return <TableDSFR {...props} />
}

export default Table
