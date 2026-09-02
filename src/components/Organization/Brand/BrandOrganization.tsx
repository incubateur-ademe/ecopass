import { UserOrganization } from "../../../db/user"
import MyBrands from "./MyBrands"
import NewDelegation from "../Delegation/NewDelegation"
import Delegations from "../Delegation/Delegations"
import NewDelegationModal from "../Delegation/NewDelegationModal"
import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import GTINPrefixes from "./GTINPrefixes"

const BrandOrganization = ({ organization }: { organization: UserOrganization }) => {
  return (
    <div data-testid='brand-organization'>
      <Tabs
        tabs={[
          {
            label: "Marques",
            content: (
              <>
                <h2>Marques déclarées</h2>
                <MyBrands organization={organization} />
              </>
            ),
          },
          {
            label: "Délégations",
            content: (
              <>
                {organization.authorizedOrganizations.length === 0 ? (
                  <NewDelegation />
                ) : (
                  <>
                    <h2>Délégations</h2>
                    <Delegations organizations={organization.authorizedOrganizations} type='to' />
                    <NewDelegationModal />
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
                    <GTINPrefixes prefixes={organization.gtinPrefixes} />
                  </>
                ),
              },
        ].filter((tab) => tab !== undefined)}
      />
    </div>
  )
}

export default BrandOrganization
