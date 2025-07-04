"use client"

import { useRouter } from "next/navigation"
import Table from "../Table/Table"
import { UserOrganization } from "../../db/user"
import { formatDateTime } from "../../services/format"
import Button from "@codegouvfr/react-dsfr/Button"
import { removeOrganizationAuthorization } from "../../serverFunctions/organization"

const Delegations = ({ organizations }: { organizations: UserOrganization["authorizedOrganizations"] }) => {
  const router = useRouter()

  return (
    <Table
      fixed
      caption='Mes délégations'
      noCaption
      headers={["Nom", "Siret", "Autorisé le", ""]}
      data={organizations.map((organization) => [
        organization.to.name,
        organization.to.siret,
        formatDateTime(organization.createdAt),
        <div key={organization.id}>
          <Button
            iconId='fr-icon-delete-bin-fill'
            onClick={() => {
              removeOrganizationAuthorization(organization.id).then(() => router.refresh())
            }}>
            Supprimer
          </Button>
        </div>,
      ])}
    />
  )
}

export default Delegations
