import { redirect } from "next/navigation"
import Login from "../../views/Login"
import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { auth } from "../../services/auth/auth"
import { getSafeCallbackUrl } from "../../utils/login"

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams
  const callbackUrl = getSafeCallbackUrl(params.next)
  const session = await auth()
  if (session) {
    redirect(callbackUrl)
  }

  return (
    <>
      <StartDsfrOnHydration />
      <Login callbackUrl={callbackUrl} />
    </>
  )
}

export default LoginPage
