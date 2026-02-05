import Table from "../../Table/Table"
import { UserOrganization } from "../../../db/user"
import DeleteDelegation from "./DeleteDelegation"

const Delegations = ({
  organizations,
  type,
}: {
  type: "to" | "from"
  organizations: UserOrganization["authorizedOrganizations"] | UserOrganization["authorizedBy"]
}) => {
  return (
    <div data-testid={`${type}-delegations-table`}>
      <Table
        fixed
        caption='Mes délégations'
        noCaption
        headers={
          type === "to" ? ["Nom", "SIRET ou identifiant unique", "Action"] : ["Nom", "SIRET ou identifiant unique"]
        }
        data={organizations.map((organization) =>
          "to" in organization
            ? [
                organization.to.name,
                organization.to.siret ?? organization.to.uniqueId ?? "N/A",
                <DeleteDelegation key={organization.id} name={organization.to.name} id={organization.id} />,
              ]
            : [organization.from.name, organization.from.siret ?? organization.from.uniqueId ?? "N/A"],
        )}
      />
    </div>
  )
}

export default Delegations
