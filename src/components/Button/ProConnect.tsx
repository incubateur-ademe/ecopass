"use client"
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton"
import { signIn } from "next-auth/react"
const ProConnect = () => {
  return <ProConnectButton onClick={() => signIn("proconnect", { callbackUrl: "/" })} />
}

export default ProConnect
