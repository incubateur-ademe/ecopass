import Table from "../../Table/Table"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { UserOrganization } from "../../../db/user"
import Badge from "@codegouvfr/react-dsfr/Badge"
import UpdateBrand from "./UpdateBrand"

const Brands = ({
  brands,
  delegated,
}: {
  brands: (UserOrganization["brands"][number] & { organization?: string })[]
  delegated?: boolean
}) => {
  return (
    <>
      <Alert
        severity='warning'
        title='Attention'
        description='Pour une identification uniforme des marques, veuillez désormais utiliser l’ID de la marque dans vos dépôts (colonne C du CSV).'
      />
      <Table
        fixed
        caption='Mes marques'
        noCaption
        headers={
          delegated
            ? ["Entreprise", "Marque", "ID de la marque", "Statut"]
            : ["Marque", "ID de la marque", "Statut", "Action"]
        }
        data={brands
          .sort((a, b) => {
            if (a.organization && b.organization) {
              const comparison = a.organization.localeCompare(b.organization)
              if (comparison !== 0) {
                return comparison
              }
            }

            if (a.default && !b.default) {
              return -1
            }
            if (!a.default && b.default) {
              return 1
            }

            if (a.active && !b.active) {
              return -1
            }
            if (!a.active && b.active) {
              return 1
            }

            return a.name.localeCompare(b.name)
          })
          .map((brand) =>
            delegated
              ? [
                  brand.organization || "",
                  <span key={brand.id} data-testid='brand-row-name'>
                    {brand.name}
                  </span>,
                  brand.id,
                  brand.default ? (
                    <Badge key={brand.id} severity='info'>
                      Défaut
                    </Badge>
                  ) : brand.active ? (
                    <Badge key={brand.id} severity='success'>
                      Marque active
                    </Badge>
                  ) : (
                    <Badge key={brand.id} severity='error'>
                      Marque retirée
                    </Badge>
                  ),
                ]
              : [
                  <span key={brand.id} data-testid='brand-row-name'>
                    {brand.name}
                  </span>,
                  brand.id,
                  brand.default ? (
                    <Badge key={brand.id} severity='info'>
                      Défaut
                    </Badge>
                  ) : brand.active ? (
                    <Badge key={brand.id} severity='success'>
                      Marque active
                    </Badge>
                  ) : (
                    <Badge key={brand.id} severity='error'>
                      Marque retirée
                    </Badge>
                  ),
                  <div key={brand.id} data-testid='brand-row-action'>
                    {brand.default ? "" : <UpdateBrand key={brand.id} brand={brand} />}
                  </div>,
                ],
          )}
      />
    </>
  )
}

export default Brands
