import { Metadata } from "next"
import { StartDsfrOnHydration } from "../dsfr-bootstrap"
import { auth } from "../services/auth/auth"
import Home from "../views/Home"

export const metadata: Metadata = {
  title: "Accueil - Affichage environnemental",
}

export default async function HomePage() {
  const session = await auth()

  return (
    <>
      <StartDsfrOnHydration />
      <Home connected={!!session} />
    </>
  )
}
