import Badge from "@codegouvfr/react-dsfr/Badge"
import { UserOrganization } from "../../db/user"
import styles from "./Informations.module.css"

const Informations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <div className={styles.container}>
      <h3>Organisation</h3>
      {organization.name}
      <Badge className={styles.badge} severity='success'>
        En activité
      </Badge>
    </div>
  )
}

export default Informations
