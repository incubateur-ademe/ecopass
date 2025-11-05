import { getHtmlAttributes, DsfrHead } from "../dsfr-bootstrap/server-only-index"
import { DsfrProvider } from "../dsfr-bootstrap"
import Header from "../components/Header/Header"
import { AuthProvider } from "../components/Provider/AuthProvider"
import { Metadata } from "next"
import Footer from "../components/Footer/Footer"
import { auth } from "../services/auth/auth"
import "../css/reset.css"
import "../css/dsfr.css"
import Matomo from "../components/Matomo/Matomo"
import { ReactNode } from "react"
import TestBanner from "../components/Test/TestBanner"
import { isTestEnvironment } from "../utils/test"
import { getUserOrganizationType } from "../serverFunctions/user"

export const metadata: Metadata = {
  title: "Affichage environnemental",
  description:
    "Ce portail a pour objectif de répondre aux articles R 541-246 et R 541-250  du Décret relatif à l'affichage environnemental textile, et de permettre ainsi aux marques de déclarer le coût environnemental de leurs produits, afin de rendre ce résultat accessible au grand public.",
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = "fr"

  const session = await auth()
  const type = await getUserOrganizationType(session?.user.id)
  return (
    <html lang={lang} {...getHtmlAttributes({ lang })}>
      <head>
        <DsfrHead preloadFonts={["Marianne-Regular", "Marianne-Medium", "Marianne-Bold"]} />
      </head>
      <body>
        <Matomo />
        <DsfrProvider lang={lang}>
          <AuthProvider session={session}>
            <Header session={session} type={type} />
            <main id='contenu' role='main' tabIndex={-1}>
              {isTestEnvironment() && <TestBanner />}
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </DsfrProvider>
      </body>
    </html>
  )
}
