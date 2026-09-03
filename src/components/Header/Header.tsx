"use client"
import { Header as HeaderDSFR } from "@codegouvfr/react-dsfr/Header"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { isTestEnvironment } from "../../utils/test"
import { organizationTypesAllowedToDeclare } from "../../utils/organization/canDeclare"
import { OrganizationType, UserType } from "@prisma/enums"
import {
  canAccessAdminSpace,
  canAccessFullData,
  canAccessProInformationSpace,
} from "../../utils/authorization/authorizations"

const Header = ({
  session,
  organizationType,
  userType,
}: {
  session: Session | null
  organizationType?: OrganizationType | null
  userType?: UserType
}) => {
  const canDeclare = organizationType ? organizationTypesAllowedToDeclare.includes(organizationType) : false
  const role = session?.user?.role
  const canAccessAdmin = canAccessAdminSpace(role)
  const canAccessData = canAccessFullData(role)
  const canAccessProInfo = canAccessProInformationSpace(role, userType)
  const pathname = usePathname()

  const adminNavigationItem = canAccessAdmin
    ? {
        text: "Admin",
        isActive: pathname.startsWith("/admin"),
        menuLinks: [
          { linkProps: { href: "/admin/stats" }, text: "Statistiques", isActive: pathname === "/admin/stats" },
          {
            linkProps: { href: "/admin/nouvel-utilisateur" },
            text: "Créer un utilisateur",
            isActive: pathname === "/admin/nouvel-utilisateur",
          },
          { linkProps: { href: "/admin/donnees" }, text: "Données", isActive: pathname === "/admin/donnees" },
        ],
      }
    : canAccessData
      ? { linkProps: { href: "/admin/donnees" }, text: "Données", isActive: pathname === "/admin/donnees" }
      : null

  const connectedNavigation = canDeclare
    ? [
        { linkProps: { href: "/" }, text: "Accueil", isActive: pathname === "/" },
        {
          linkProps: { href: "/declarations" },
          text: "Déclarations",
          isActive: pathname.startsWith("/declarations"),
        },
        { linkProps: { href: "/produits" }, text: "Produits déclarés", isActive: pathname.startsWith("/produits") },
        { linkProps: { href: "/api" }, text: "API", isActive: pathname.startsWith("/api") },
        {
          linkProps: { href: "/organisation" },
          text: "Organisation",
          isActive: pathname.startsWith("/organisation"),
        },
        adminNavigationItem,
      ]
    : [
        { linkProps: { href: "/" }, text: "Accueil", isActive: pathname === "/" },
        canAccessProInfo
          ? {
              linkProps: { href: "/organisation" },
              text: "Organisation",
              isActive: pathname.startsWith("/organisation"),
            }
          : null,
        canAccessProInfo
          ? { linkProps: { href: "/informations" }, text: "Informez-vous", isActive: pathname === "/informations" }
          : null,
        userType === UserType.CITOYEN
          ? {
              linkProps: { href: "/declaration-simplifiee" },
              text: "Déclaration simplifiée",
              isActive: pathname.startsWith("/declaration-simplifiee"),
            }
          : null,
        { linkProps: { href: "/produits" }, text: "Produits déclarés", isActive: pathname == "/produits" },
        {
          linkProps: { href: "/marques" },
          text: "Les marques",
          isActive: pathname.startsWith("/marques"),
        },
        {
          linkProps: { href: "/recherche" },
          text: "Rechercher un produit",
          isActive: pathname === "/recherche" || pathname.startsWith("/produits/"),
        },
        organizationType === OrganizationType.Distributor
          ? { linkProps: { href: "/api" }, text: "API", isActive: pathname.startsWith("/api") }
          : null,
        adminNavigationItem,
      ]

  const visitorNavigation = [
    { linkProps: { href: "/" }, text: "Vous êtes consommateurs", isActive: pathname === "/" },
    {
      linkProps: { href: "/professionnels" },
      text: "Vous êtes professionnels",
      isActive: pathname === "/professionnels",
    },
    { linkProps: { href: "/informations" }, text: "Informez-vous", isActive: pathname === "/informations" },
    {
      linkProps: { href: "/marques" },
      text: "Les marques",
      isActive: pathname.startsWith("/marques"),
    },
    {
      linkProps: { href: "/recherche" },
      text: "Rechercher un produit",
      isActive: pathname === "/recherche" || pathname.startsWith("/produits/"),
    },
  ]

  const connected = !!session?.user

  return (
    <HeaderDSFR
      brandTop={
        <>
          République
          <br />
          Française
        </>
      }
      homeLinkProps={{
        href: "/",
        title: "Accueil - Affichage environnemental",
      }}
      serviceTitle='Affichage environnemental'
      serviceTagline={isTestEnvironment() ? "Serveur de test" : undefined}
      navigation={(connected ? connectedNavigation : visitorNavigation).filter((item) => item !== null)}
      quickAccessItems={[
        {
          linkProps: {
            href: isTestEnvironment()
              ? "https://docs.numerique.gouv.fr/docs/fd1182f0-2180-4a62-9531-bf23e812886e/"
              : "https://docs.numerique.gouv.fr/docs/4c19480c-746e-49d9-aa1c-8b94f8790720/",
            target: "_blank",
            rel: "noopener noreferrer",
          },
          iconId: connected ? "fr-icon-information-fill" : "fr-icon-information-line",
          text: "Centre d'aide",
        },
        connected
          ? {
              linkProps: {
                href: "/logout",
              },
              iconId: "ri-account-circle-fill",
              text: "Se déconnecter",
            }
          : {
              linkProps: {
                href: pathname === "/" ? "/login/public" : "/login",
              },
              iconId: "ri-account-circle-line",
              text: "Se connecter",
            },
      ]}
    />
  )
}

export default Header
