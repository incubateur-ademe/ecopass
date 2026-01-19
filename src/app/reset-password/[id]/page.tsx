import { redirect } from "next/navigation"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../../services/auth/auth"
import ResetPassword from "../../../views/ResetPassword"

type Props = {
  params: Promise<{ id: string }>
}

const ResetPasswordPage = async (props: Props) => {
  const session = await auth()
  if (session) {
    redirect("/")
  }
  const params = await props.params

  return (
    <>
      <StartDsfrOnHydration />
      <ResetPassword token={params.id} />
    </>
  )
}

export default ResetPasswordPage
