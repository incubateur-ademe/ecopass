"use server"
import { auth } from "../../services/auth/auth"
import { formatDateTime } from "../../services/format"
import Table from "../Table/Table"
import styles from "./Products.module.css"
import { getExportsByUserId } from "../../db/export"
import Button from "@codegouvfr/react-dsfr/Button"
import { Status } from "../../../prisma/src/prisma"

const Exports = async () => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }

  const exports = await getExportsByUserId(session.user.id)

  return (
    exports.length > 0 && (
      <Table
        className={styles.table}
        fixed
        caption='Mes produits'
        noCaption
        headers={["Date", "Status", "Nom", ""]}
        data={exports.map((item) => [
          formatDateTime(item.createdAt),
          item.status,
          item.name,
          item.status == Status.Done ? (
            <Button linkProps={{ href: `/export/${item.name}` }} key={item.name}>
              Télécharger
            </Button>
          ) : (
            ""
          ),
        ])}
      />
    )
  )
}

export default Exports
