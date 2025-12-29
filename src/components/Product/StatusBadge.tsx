import { Status } from "@prisma/enums"
import Badge from "@codegouvfr/react-dsfr/Badge"

const statusTitle: Record<Status, string> = {
  [Status.Done]: "Prêt à télécharger",
  [Status.Error]: "En erreur",
  [Status.Pending]: "Création en cours",
  [Status.Processing]: "Création en cours",
}

const statusColor: Record<Status, "success" | "error" | "info" | "warning"> = {
  [Status.Done]: "success",
  [Status.Error]: "error",
  [Status.Pending]: "info",
  [Status.Processing]: "info",
}

const StatusBadge = ({ status }: { status: Status }) => {
  return <Badge severity={statusColor[status]}>{statusTitle[status]}</Badge>
}

export default StatusBadge
