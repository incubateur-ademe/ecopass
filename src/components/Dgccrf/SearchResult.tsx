"use client"
import Alert from "@codegouvfr/react-dsfr/Alert"
import Block from "../Block/Block"
import Table from "../Table/Table"
import { organizationTypes } from "../../utils/organization/types"
import { OrganizationType } from "@prisma/enums"
import Badge from "@codegouvfr/react-dsfr/Badge"
import { OrganizationAndBrands } from "../../serverFunctions/dgccrf"
import Button from "@codegouvfr/react-dsfr/Button"

const SearchResult = ({ organizations, brands }: OrganizationAndBrands) => {
  const totalResults = organizations.length + brands.length
  return (
    <Block>
      <h2>Résultats de la recherche</h2>
      <h3>
        {totalResults} élément{totalResults > 1 ? "s" : ""} trouvé{totalResults > 1 ? "s" : ""}
      </h3>

      {totalResults > 0 && (
        <Table
          noCaption
          fixed
          headers={["Nom", "Nom d'usage", "SIRET", "Type", "Références", "Liens", "Détails"]}
          data={[
            ...organizations.map((organization) => ({
              count: organization.references,
              link:
                organization.type === OrganizationType.Consultancy
                  ? organization.authorizedBy.length
                  : organization.brands.length,
              data: [
                organization.name,
                organization.displayName,
                organization.siret,
                organization.type ? organizationTypes[organization.type as OrganizationType] : "N/A",
                <Badge key={organization.id} severity='info' noIcon>
                  {organization.references}
                </Badge>,
                <Badge key={organization.id} severity='info' noIcon>
                  {organization.type === OrganizationType.Consultancy
                    ? organization.authorizedBy.length
                    : organization.brands.length}
                </Badge>,
                <Button
                  key={organization.id}
                  priority='secondary'
                  linkProps={{ href: `/organisations/${organization.id}` }}>
                  Voir le détail
                </Button>,
              ],
            })),
            ...brands.map((brand) => ({
              count: brand.references,
              link: 0,
              data: [
                brand.name,
                "-",
                "-",
                "Marque déclarée",
                <Badge key={brand.id} severity='info' noIcon>
                  {brand.references}
                </Badge>,
                "",
                <Button key={brand.id} priority='secondary' linkProps={{ href: `/marques/${brand.id}` }}>
                  Voir le détail
                </Button>,
              ],
            })),
          ]
            .sort((a, b) => b.count - a.count || b.link - a.link)
            .map((item) => item.data)}
        />
      )}

      {totalResults === 0 && (
        <Alert severity='info' small description='Aucun résultat ne correspond à votre recherche.' />
      )}
    </Block>
  )
}

export default SearchResult
