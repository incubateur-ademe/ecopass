import Badge from "@codegouvfr/react-dsfr/Badge"
import { UserOrganization } from "../../db/user"
import styles from "./Informations.module.css"
import { organizationTypeByNaf } from "../../utils/admin/nafs"
import Link from "next/link"
import { OrganizationType } from "../../../prisma/src/prisma"
import { organizationTypesAllowedToDeclare } from "../../utils/organization/canDeclare"
import OrganizationName from "./OrganizationName"

const types: Record<OrganizationType, string> = {
  [OrganizationType.Brand]: "Marque",
  [OrganizationType.Distributor]: "Distributeur",
  [OrganizationType.BrandAndDistributor]: "Marque et distributeur",
  [OrganizationType.Consultancy]: "Bureau d'études",
  [OrganizationType.Other]: "Autre",
}

const Informations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <div className={styles.container}>
      <h2>Organisation</h2>
      <div>
        <p data-testid='organization-name'>{organization.name}</p>
        <Badge className={styles.badge} severity='success'>
          En activité
        </Badge>
        {organization.type && organizationTypesAllowedToDeclare.includes(organization.type) && (
          <OrganizationName organization={organization} />
        )}
      </div>
      {organization.type && (
        <div>
          <b>Type</b>
          <p data-testid='organization-type'>{types[organization.type]}</p>
          {(!organization.naf || !organizationTypeByNaf[organization.naf]) && (
            <p className={styles.hint}>
              Ce n'est pas le bon type d'organisation ? Veuillez{" "}
              <Link
                className='fr-link'
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}
                prefetch={false}
                target='_blank'
                rel='noopener noreferrer'>
                nous contacter.
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Informations
