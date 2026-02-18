"use client"
import { Header as HeaderDSFR } from "@codegouvfr/react-dsfr/Header"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { isTestEnvironment } from "../../utils/test"
import { organizationTypesAllowedToDeclare } from "../../utils/organization/canDeclare"
import { OrganizationType, UserRole } from "@prisma/enums"

const Header = ({ session, type }: { session: Session | null; type: OrganizationType | null }) => {
  const canDeclare = type ? organizationTypesAllowedToDeclare.includes(type) : false
  const pathname = usePathname()
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
      navigation={(session && session.user
        ? canDeclare
          ? [
              { linkProps: { href: "/" }, text: "Accueil", isActive: pathname === "/" },
              {
                linkProps: { href: "/declarations" },
                text: "Déclarations",
                isActive: pathname.startsWith("/declarations"),
              },
              {
                linkProps: { href: "/produits" },
                text: "Produits déclarés",
                isActive: pathname.startsWith("/produits"),
              },
              { linkProps: { href: "/api" }, text: "API", isActive: pathname.startsWith("/api") },
              {
                linkProps: { href: "/organisation" },
                text: "Organisation",
                isActive: pathname.startsWith("/organisation"),
              },
              session.user.role === UserRole.ADMIN
                ? {
                    text: "Admin",
                    isActive: pathname.startsWith("/admin"),
                    menuLinks: [
                      {
                        linkProps: { href: "/admin" },
                        text: "Statistiques",
                        isActive: pathname === "/admin",
                      },
                      {
                        linkProps: { href: "/admin/nouvel-utilisateur" },
                        text: "Créer un utilisateur",
                        isActive: pathname === "/admin/nouvel-utilisateur",
                      },
                    ],
                  }
                : null,
            ]
          : [
              { linkProps: { href: "/" }, text: "Accueil", isActive: pathname === "/" },
              {
                linkProps: { href: "/organisation" },
                text: "Organisation",
                isActive: pathname.startsWith("/organisation"),
              },
              {
                linkProps: { href: "/informations" },
                text: "Informez-vous",
                isActive: pathname === "/informations",
              },
              {
                linkProps: { href: "/marques" },
                text: "Les marques déclarantes",
                isActive: pathname.startsWith("/marques"),
              },
              {
                linkProps: { href: "/recherche" },
                text: "Recherchez un produit",
                isActive: pathname === "/recherche" || pathname.startsWith("/produits/"),
              },
              type === OrganizationType.Distributor
                ? { linkProps: { href: "/api" }, text: "API", isActive: pathname.startsWith("/api") }
                : null,
              session.user.role === UserRole.ADMIN
                ? {
                    text: "Admin",
                    isActive: pathname.startsWith("/admin"),
                    menuLinks: [
                      {
                        linkProps: { href: "/admin" },
                        text: "Statistiques",
                        isActive: pathname === "/admin",
                      },
                      {
                        linkProps: { href: "/admin/nouvel-utilisateur" },
                        text: "Créer un utilisateur",
                        isActive: pathname === "/admin/nouvel-utilisateur",
                      },
                    ],
                  }
                : null,
            ]
        : [
            {
              linkProps: { href: "/" },
              text: "Vous êtes consommateurs",
              isActive: pathname === "/",
            },
            {
              linkProps: { href: "/professionnels" },
              text: "Vous êtes professionnels",
              isActive: pathname === "/professionnels",
            },
            {
              linkProps: { href: "/informations" },
              text: "Informez-vous",
              isActive: pathname === "/informations",
            },
            {
              linkProps: { href: "/marques" },
              text: "Les marques déclarantes",
              isActive: pathname.startsWith("/marques"),
            },
            {
              linkProps: { href: "/recherche" },
              text: "Recherchez un produit",
              isActive: pathname === "/recherche" || pathname.startsWith("/produits/"),
            },
          ]
      ).filter((item) => item !== null)}
      quickAccessItems={
        session && session.user
          ? [
              {
                linkProps: {
                  href: "/logout",
                },
                iconId: "ri-account-circle-fill",
                text: "Se déconnecter",
              },
            ]
          : [
              {
                linkProps: {
                  href: "/login",
                },
                iconId: "ri-account-circle-line",
                text: "Se connecter",
              },
            ]
      }
    />
  )
}

export default Header
