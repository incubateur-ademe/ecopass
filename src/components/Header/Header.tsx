import { Header as HeaderDSFR } from "@codegouvfr/react-dsfr/Header"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { Session } from "next-auth"

const Header = ({ session }: { session: Session | null }) => {
  return (
    <HeaderDSFR
      brandTop='Écopass'
      homeLinkProps={{
        href: "/",
        title: "Accueil - Écopass",
      }}
      serviceTitle={
        <>
          Écopass
          <Badge as='span' noIcon severity='success'>
            Beta
          </Badge>
        </>
      }
      navigation={
        session
          ? [
              { linkProps: { href: "/" }, text: "Accueil" },
              { linkProps: { href: "/produits" }, text: "Produits" },
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
