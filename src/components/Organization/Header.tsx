import { Organization } from "../../db/organization"
import { organizationTypes } from "../../utils/organization/types"
import styles from "./Header.module.css"
import AdminForm from "./AdminForm"

const Header = ({ organization, isAdmin }: { organization: Organization; isAdmin: boolean }) => {
  return (
    <div className={styles.header}>
      <div>
        <h1>{organization.name}</h1>
        {organization.displayName !== organization.name && (
          <p>
            Nom d'usage : <b>{organization.displayName}</b>
          </p>
        )}
        {organization.type && (
          <p data-testid='organization-type'>
            Type : <b>{organizationTypes[organization.type]}</b>
          </p>
        )}
        {organization.siret && (
          <p>
            SIRET : <b>{organization.siret}</b>
          </p>
        )}
        {isAdmin && organization.noGTIN && <p data-testid='organization-no-gtin'>Organisation sans GTIN</p>}
      </div>
      {isAdmin && <AdminForm id={organization.id} type={organization.type} noGTIN={organization.noGTIN} />}
    </div>
  )
}

export default Header
