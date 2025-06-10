"use client"

import { Header as HeaderDSFR } from "@codegouvfr/react-dsfr/Header"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"

const Header = ({ session }: { session: Session | null }) => {
  const pathname = usePathname()
  return (
    <HeaderDSFR
      brandTop='République Française'
      homeLinkProps={{
        href: "/",
        title: "Accueil - Affichage environnemental",
      }}
      serviceTitle={
        <>
          Affichage environnemental
          <Badge as='span' noIcon severity='success'>
            Beta
          </Badge>
        </>
      }
      navigation={
        session
          ? [
              { linkProps: { href: "/" }, text: "Accueil", isActive: pathname === "/" },
              {
                linkProps: { href: "/declarations" },
                text: "Mes déclarations",
                isActive: pathname.startsWith("/declarations"),
              },
              { linkProps: { href: "/produits" }, text: "Mes produits", isActive: pathname.startsWith("/produits") },
              { linkProps: { href: "/api" }, text: "API", isActive: pathname.startsWith("/api") },
            ]
          : []
      }
      quickAccessItems={[
        session
          ? {
              linkProps: {
                href: "/logout",
              },
              iconId: "ri-account-circle-fill",
              text: "Se déconnecter",
            }
          : {
              linkProps: {
                href: "/login",
              },
              iconId: "ri-account-circle-line",
              text: "Se connecter",
            },
      ]}
    />
  )
}

export default Header
