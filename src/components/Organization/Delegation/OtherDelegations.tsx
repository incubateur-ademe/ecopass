import Alert from "@codegouvfr/react-dsfr/Alert"
import { UserOrganization } from "../../../db/user"
import Delegations from "./Delegations"

const OtherDelegations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      {!organization.siret && organization.uniqueId && (
        <Alert
          severity='info'
          small
          description={
            <>
              Pour être référencé en tant que délégataire par une marque, veuillez leur communiquer votre identifiant
              unique : <b>{organization.uniqueId}</b>
            </>
          }
        />
      )}
      {organization.authorizedBy.length === 0 ? (
        <Alert severity='info' small description='Aucune entreprise ne vous a délégué de droits pour le moment.' />
      ) : (
        <Delegations organizations={organization.authorizedBy} type='from' />
      )}
    </>
  )
}

export default OtherDelegations
