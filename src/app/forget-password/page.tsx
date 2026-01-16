import { redirect } from "next/navigation"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../services/auth/auth"
import ForgetPassword from "../../views/ForgetPassword"

const ForgetPasswordPage = async () => {
  console.log("[MEMORY][forget-password/page][start]", process.memoryUsage())
  const session = await auth()
  if (session) {
    console.log("[MEMORY][forget-password/page][end]", process.memoryUsage())
    redirect("/")
  }

  const result = (
    <>
      <StartDsfrOnHydration />
      <ForgetPassword />
    </>
  )
  console.log("[MEMORY][forget-password/page][end]", process.memoryUsage())
  return result
}

export default ForgetPasswordPage
