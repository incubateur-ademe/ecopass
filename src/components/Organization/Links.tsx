import { OrganizationType } from "@prisma/enums"
import { Organization } from "../../db/organization"
import Table from "../Table/Table"
import tableStyles from "../Table/Table.module.css"
import Button from "@codegouvfr/react-dsfr/Button"
import Badge from "@codegouvfr/react-dsfr/Badge"
import { formatDate } from "../../services/format"
import classNames from "classnames"

const Links = ({ organization }: { organization: Organization }) => {
  const brands = [
    ...organization.authorizedBy.flatMap((authorization) => authorization.from.brands),
    ...organization.brands,
  ]

  return (
    <>
      {organization.type !== OrganizationType.Consultancy && organization.authorizedOrganizations.length > 0 && (
        <div data-testid='consultancies-organizations-list'>
          <Table
            fixed
            caption={`${organization.authorizedOrganizations.length} Bureau${organization.authorizedOrganizations.length > 1 ? "x" : ""} d’études lié${organization.authorizedOrganizations.length > 1 ? "s" : ""}`}
            headers={["Nom", "Nom d'usage", "SIRET", "Etat", "Références", "Dernière date de dépôt", "Détails"]}
            data={organization.authorizedOrganizations
              .sort((a, b) => a.to.name.localeCompare(b.to.name))
              .map((link) => [
                <b key={link.to.id}>{link.to.name}</b>,
                link.to.displayName,
                link.to.siret || "N/A",
                <Badge key={link.to.id} severity={link.active ? "success" : "error"} noIcon>
                  {link.active ? "Actif" : "Inactif"}
                </Badge>,
                <Badge key={link.to.id} severity='info' noIcon>
                  {link.references}
                </Badge>,
                link.lastDeclaration ? formatDate(link.lastDeclaration) : "",
                <Button key={link.to.id} priority='secondary' linkProps={{ href: `/organisations/${link.to.id}` }}>
                  Voir le détail
                </Button>,
              ])}
          />
        </div>
      )}
      {organization.authorizedBy.length > 0 && (
        <div data-testid='brands-organizations-list'>
          <Table
            fixed
            caption={`${organization.authorizedBy.length} Marque${organization.authorizedBy.length > 1 ? "s" : ""}`}
            headers={["Nom", "Nom d'usage", "SIRET", "Etat", "Références", "Dernière date de dépôt", "Détails"]}
            data={organization.authorizedBy
              .sort((a, b) => a.from.name.localeCompare(b.from.name))
              .map((link) => [
                <b key={link.from.id}>{link.from.name}</b>,
                link.from.displayName,
                link.from.siret || "N/A",
                <Badge key={link.from.id} severity={link.active ? "success" : "error"} noIcon>
                  {link.active ? "Active" : "Inactive"}
                </Badge>,
                <Badge key={link.from.id} severity='info' noIcon>
                  {link.references}
                </Badge>,
                link.lastDeclaration ? formatDate(link.lastDeclaration) : "",
                <Button key={link.from.id} priority='secondary' linkProps={{ href: `/organisations/${link.from.id}` }}>
                  Voir le détail
                </Button>,
              ])}
          />
        </div>
      )}
      {brands.length > 0 && (
        <div className={classNames("fr-table fr-table--layout-fixed", tableStyles.table)} data-testid='brands-list'>
          <table>
            <caption>{`${brands.length} Marque${brands.length > 1 ? "s" : ""} déclarée${brands.length > 1 ? "s" : ""}`}</caption>
            <thead>
              <tr>
                <th scope='col'>Nom</th>
                <th scope='col'></th>
                <th scope='col'></th>
                <th scope='col'>Etat</th>
                <th scope='col'>Références</th>
                <th scope='col'>Dernière date de dépôt</th>
                <th scope='col'>Détails</th>
              </tr>
            </thead>
            <tbody>
              {brands
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((link) => (
                  <tr key={link.id}>
                    <td colSpan={3}>
                      <b>{link.name}</b>
                    </td>
                    <td>
                      <Badge severity={link.active ? "success" : "error"} noIcon>
                        {link.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <Badge severity='info' noIcon>
                        {link.references}
                      </Badge>
                    </td>
                    <td>{link.lastDeclaration ? formatDate(link.lastDeclaration) : ""}</td>
                    <td>
                      <Button priority='secondary' linkProps={{ href: `/marques/${link.id}` }}>
                        Voir le détail
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Links
