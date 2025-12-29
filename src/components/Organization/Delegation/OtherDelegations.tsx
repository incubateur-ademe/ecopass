import Alert from "@codegouvfr/react-dsfr/Alert"
import { UserOrganization } from "../../../db/user"
import Delegations from "./Delegations"

const OtherDelegations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      {organization.authorizedBy.length === 0 ? (
        <Alert severity='info' small description='Aucune entreprise ne vous a délégué de droits pour le moment.' />
      ) : (
        <Delegations organizations={organization.authorizedBy} type='from' />
      )}
    </>
  )
}

export default OtherDelegations
