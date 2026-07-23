import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import { UserOrganization } from "../../db/user"
import OtherBrands from "./Brand/OtherBrands"
import OtherDelegations from "./Delegation/OtherDelegations"

const ConsultancyOrganization = ({ organization }: { organization: UserOrganization }) => {
  return (
    <div data-testid='consultancy-organization'>
      <Tabs
        tabs={[
          {
            label: "Marques",
            content: (
              <>
                <h2>Marques déléguées</h2>
                <OtherBrands organization={organization} />
              </>
            ),
          },
          {
            label: "Délégations",
            content: (
              <>
                <h2>Délégations</h2>
                <OtherDelegations organization={organization} />
              </>
            ),
          },
        ]}
      />
    </div>
  )
}

export default ConsultancyOrganization
