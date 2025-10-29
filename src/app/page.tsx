import { Metadata } from "next"
import { StartDsfrOnHydration } from "../dsfr-bootstrap"
import Home from "../views/Home"
import { tryAndGetSession } from "../services/auth/redirect"

export const metadata: Metadata = {
  title: "Accueil - Affichage environnemental",
}

export default async function HomePage() {
  const session = await tryAndGetSession(false, true)
  return (
    <>
      <StartDsfrOnHydration />
      <Home connected={!!session} />
    </>
  )
}
