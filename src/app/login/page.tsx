import { redirect } from "next/navigation"
import Login from "../../views/Login"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../services/auth/auth"
import "../../css/login.css"

const LoginPage = async () => {
  console.log("[MEMORY][login/page][start]", process.memoryUsage())
  const session = await auth()
  if (session) {
    console.log("[MEMORY][login/page][end]", process.memoryUsage())
    redirect("/")
  }

  const result = (
    <>
      <StartDsfrOnHydration />
      <Login />
    </>
  )
  console.log("[MEMORY][login/page][end]", process.memoryUsage())
  return result
}

export default LoginPage
