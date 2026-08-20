import { UserOrganization } from "../../../db/user"
import MyBrands from "./MyBrands"
import NewDelegation from "../Delegation/NewDelegation"
import Delegations from "../Delegation/Delegations"
import NewDelegationModal from "../Delegation/NewDelegationModal"
import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import GTINPrefixes from "./GTINPrefixes"
import { OrganizationMember } from "../../../db/organization"
import OrganizationMembers from "../OrganizationMembers"
import { Alert } from "@codegouvfr/react-dsfr/Alert"

const BrandOrganization = ({
  organization,
  isAdmin,
  members,
}: {
  organization: UserOrganization
  isAdmin: boolean
  members: OrganizationMember[]
}) => {
  return (
    <div data-testid='brand-organization'>
      <Tabs
        tabs={[
          {
            label: "Marques",
            content: (
              <>
                <h2>Marques déclarées</h2>
                <MyBrands organization={organization} isAdmin={isAdmin} />
              </>
            ),
          },
          {
            label: "Délégations",
            content: (
              <>
                {organization.authorizedOrganizations.length === 0 ? (
                  isAdmin ? (
                    <NewDelegation />
                  ) : (
                    <Alert small severity='info' description="Vous n'avez pas encore de délégations." />
                  )
                ) : (
                  <>
                    <h2>Délégations</h2>
                    <Delegations organizations={organization.authorizedOrganizations} type='to' />
                    {isAdmin && <NewDelegationModal />}
                  </>
                )}
              </>
            ),
          },
          organization.noGTIN
            ? undefined
            : {
                label: "GTIN préfixes",
                content: (
                  <>
                    <h2>Ajouter vos préfixes GTIN</h2>
                    <p>
                      Pour associer votre marque aux produits déclarés par des tiers et vous notifier, vous devez
                      renseigner les 6 premiers chiffres de vos codes GTIN.
                    </p>
                    <GTINPrefixes prefixes={organization.gtinPrefixes} isAdmin={isAdmin} />
                  </>
                ),
              },
          {
            label: "Membres",
            content: (
              <>
                <h2>Membres de l'organisation</h2>
                <OrganizationMembers organizationId={organization.id} members={members} isAdmin={isAdmin} />
              </>
            ),
          },
        ].filter((tab) => tab !== undefined)}
      />
    </div>
  )
}

export default BrandOrganization
