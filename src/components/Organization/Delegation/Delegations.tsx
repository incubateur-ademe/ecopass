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
        headers={type === "to" ? ["Nom", "Siret", "Action"] : ["Nom", "Siret"]}
        data={organizations.map((organization) =>
          "to" in organization
            ? [
                organization.to.name,
                organization.to.siret ?? "N/A",
                <DeleteDelegation key={organization.id} name={organization.to.name} id={organization.id} />,
              ]
            : [organization.from.name, organization.from.siret ?? "N/A"],
        )}
      />
    </div>
  )
}

export default Delegations
