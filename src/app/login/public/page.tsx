import { redirect } from "next/navigation"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../../services/auth/auth"
import PublicLogin from "../../../views/PublicLogin"

const LoginPage = async () => {
  const session = await auth()
  if (session) {
    redirect("/")
  }

  return (
    <>
      <StartDsfrOnHydration />
      <PublicLogin />
    </>
  )
}

export default LoginPage
