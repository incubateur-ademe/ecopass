import { Status } from "../../../prisma/src/prisma"
import Badge from "@codegouvfr/react-dsfr/Badge"

const statusTitle: Record<Status, string> = {
  [Status.Done]: "Déclaration validée",
  [Status.Error]: "À corriger",
  [Status.Pending]: "Analyse en cours",
  [Status.Processing]: "Analyse en cours",
}

const statusColor: Record<Status, "success" | "error" | "info" | "warning"> = {
  [Status.Done]: "success",
  [Status.Error]: "error",
  [Status.Pending]: "info",
  [Status.Processing]: "info",
}

const StatusBadge = ({ status, total, done }: { status: Status; total: number; done: number }) => {
  const text =
    status === Status.Processing
      ? `${statusTitle[status]} ${total > 0 ? `(${done}/${total})` : ""}`
      : statusTitle[status]
  return <Badge severity={statusColor[status]}>{text}</Badge>
}

export default StatusBadge
