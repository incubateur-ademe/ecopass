import { redirect } from "next/navigation"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../../services/auth/auth"
import ResetPassword from "../../../views/ResetPassword"

type Props = {
  params: Promise<{ id: string }>
}

const ResetPasswordPage = async (props: Props) => {
  console.log("[MEMORY][reset-password/[id]/page][start]", process.memoryUsage())
  const session = await auth()
  if (session) {
    console.log("[MEMORY][reset-password/[id]/page][end]", process.memoryUsage())
    redirect("/")
  }
  const params = await props.params

  const result = (
    <>
      <StartDsfrOnHydration />
      <ResetPassword token={params.id} />
    </>
  )
  console.log("[MEMORY][reset-password/[id]/page][end]", process.memoryUsage())
  return result
}

export default ResetPasswordPage
