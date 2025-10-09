"use client"
import { Header as HeaderDSFR } from "@codegouvfr/react-dsfr/Header"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { UserRole } from "../../../prisma/src/prisma"

const Header = ({ session }: { session: Session | null }) => {
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
      serviceTitle={<>Affichage environnemental</>}
      navigation={
        session && session.user
          ? [
              { linkProps: { href: "/" }, text: "Accueil", isActive: pathname === "/" },
              {
                linkProps: { href: "/declarations" },
                text: "Mes déclarations",
                isActive: pathname.startsWith("/declarations"),
              },
              { linkProps: { href: "/produits" }, text: "Mes produits", isActive: pathname.startsWith("/produits") },
              { linkProps: { href: "/api" }, text: "API", isActive: pathname.startsWith("/api") },
              {
                linkProps: { href: "/organisation" },
                text: "Mon organisation",
                isActive: pathname.startsWith("/organisation"),
              },
              ...(session.user.role === UserRole.ADMIN
                ? [{ linkProps: { href: "/admin" }, text: "Admin", isActive: pathname.startsWith("/admin") }]
                : []),
            ]
          : []
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
