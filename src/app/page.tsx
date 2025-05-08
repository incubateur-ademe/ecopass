import { StartDsfrOnHydration } from "../dsfr-bootstrap"
import { auth } from "../services/auth/auth"
import Home from "../views/Home"

export default async function HomePage() {
  const session = await auth()

  return (
    <>
      <StartDsfrOnHydration />
      <Home connected={!!session} />
    </>
  )
}
