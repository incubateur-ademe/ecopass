"use client"
import { Header as HeaderDSFR } from "@codegouvfr/react-dsfr/Header"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { OrganizationType, UserRole } from "../../../prisma/src/prisma"
import { isTestEnvironment } from "../../utils/test"
import { organizationTypesAllowedToDeclare } from "../../utils/organization/canDeclare"

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
      navigation={
        session && session.user
          ? [
              { linkProps: { href: "/" }, text: "Accueil", isActive: pathname === "/" },
              canDeclare
                ? {
                    linkProps: { href: "/declarations" },
                    text: "Déclarations",
                    isActive: pathname.startsWith("/declarations"),
                  }
                : null,
              canDeclare
                ? {
                    linkProps: { href: "/produits" },
                    text: "Produits déclarés",
                    isActive: pathname.startsWith("/produits"),
                  }
                : null,
              canDeclare ? { linkProps: { href: "/api" }, text: "API", isActive: pathname.startsWith("/api") } : null,
              {
                linkProps: { href: "/organisation" },
                text: "Organisation",
                isActive: pathname.startsWith("/organisation"),
              },
              session.user.role === UserRole.ADMIN
                ? { linkProps: { href: "/admin" }, text: "Admin", isActive: pathname.startsWith("/admin") }
                : null,
            ].filter((link) => link !== null)
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
                text: "Consultez la liste des marques",
                isActive: pathname.startsWith("/marques"),
              },
              {
                linkProps: { href: "/recherche" },
                text: "Recherchez un produit",
                isActive: pathname === "/recherche",
              },
            ]
      }
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
          : []
      }
    />
  )
}

export default Header
