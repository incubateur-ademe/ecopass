import { redirect } from "next/navigation"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../services/auth/auth"
import ForgetPassword from "../../views/ForgetPassword"

const ForgetPasswordPage = async () => {
  const session = await auth()
  if (session) {
    redirect("/")
  }

  return (
    <>
      <StartDsfrOnHydration />
      <ForgetPassword />
    </>
  )
}

export default ForgetPasswordPage
