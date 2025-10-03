"use client"

import { useRouter } from "next/navigation"
import Table from "../Table/Table"
import { UserOrganization } from "../../db/user"
import { formatDateTime } from "../../services/format"
import Button from "@codegouvfr/react-dsfr/Button"
import { removeOrganizationAuthorization } from "../../serverFunctions/organization"

const Delegations = ({
  organizations,
  type,
}: {
  type: "to" | "from"
  organizations: UserOrganization["authorizedOrganizations"] | UserOrganization["authorizedBy"]
}) => {
  const router = useRouter()

  return (
    <div data-testid={`${type}-delegations-table`}>
      <Table
        fixed
        caption='Mes délégations'
        noCaption
        headers={["Nom", "Siret", "Autorisé le", type === "from" ? "Marques" : ""]}
        data={organizations.map((organization) =>
          "to" in organization
            ? [
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
              ]
            : [
                organization.from.name,
                organization.from.siret,
                formatDateTime(organization.createdAt),
                organization.from.brands.map((b) => b.name).join(", "),
              ],
        )}
      />
    </div>
  )
}

export default Delegations
