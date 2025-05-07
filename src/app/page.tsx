import { StartDsfrOnHydration } from "../dsfr-bootstrap"
import { auth } from "../services/auth/auth"
import ConnectedHome from "../views/ConnectedHome"
import Home from "../views/Home"

export default async function HomePage() {
  const session = await auth()

  return (
    <>
      <StartDsfrOnHydration />
      {session ? <ConnectedHome /> : <Home />}
    </>
  )
}
