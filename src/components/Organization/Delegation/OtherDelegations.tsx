import Alert from "@codegouvfr/react-dsfr/Alert"
import { UserOrganization } from "../../../db/user"
import Delegations from "./Delegations"
import Badge from "@codegouvfr/react-dsfr/Badge"

const OtherDelegations = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      {!organization.siret && organization.uniqueId && (
        <p className='fr-mb-2w'>
          Pour être référencé en tant que délégataire par une marque, veuillez leur communiquer votre identifiant
          unique : <Badge>{organization.uniqueId}</Badge>
        </p>
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
