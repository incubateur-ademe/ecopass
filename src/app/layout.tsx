import { getHtmlAttributes, DsfrHead } from "../dsfr-bootstrap/server-only-index"
import { DsfrProvider } from "../dsfr-bootstrap"
import { Header } from "@codegouvfr/react-dsfr/Header"
import { Footer } from "@codegouvfr/react-dsfr/Footer"

export default function RootLayout({ children }: { children: React.JSX.Element }) {
  const lang = "fr"

  return (
    <html lang={lang} {...getHtmlAttributes({ lang })}>
      <head>
        <DsfrHead preloadFonts={["Marianne-Regular", "Marianne-Medium", "Marianne-Bold"]} />
      </head>
      <body>
        <DsfrProvider lang={lang}>
          <Header
            brandTop='Écopass'
            homeLinkProps={{
              href: "/",
              title: "Accueil - Écopass",
            }}
          />
          {children}
          <Footer
            accessibility='non compliant'
            contentDescription='
    Ce message est à remplacer par les informations de votre site.

    Comme exemple de contenu, vous pouvez indiquer les informations 
    suivantes : Le site officiel d’information administrative pour les entreprises.
    Retrouvez toutes les informations et démarches administratives nécessaires à la création, 
    à la gestion et au développement de votre entreprise.
    '
            termsLinkProps={{
              href: "#",
            }}
            websiteMapLinkProps={{
              href: "#",
            }}
          />
        </DsfrProvider>
      </body>
    </html>
  )
}
