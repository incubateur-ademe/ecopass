import { redirect } from "next/navigation"
import Login from "../../views/Login"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../services/auth/auth"
import "../../css/login.css"

const LoginPage = async () => {
  const session = await auth()
  if (session) {
    redirect("/")
  }

  return (
    <>
      <StartDsfrOnHydration />
      <Login />
    </>
  )
}

export default LoginPage
