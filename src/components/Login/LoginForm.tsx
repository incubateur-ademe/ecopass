"use client"

import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton"
import { signIn } from "next-auth/react"
import styles from "./LoginForm.module.css"
import { track } from "../../utils/matomo"
import ProCredentials from "./ProCredentials"

const LoginForm = ({ test, callbackUrl }: { test: boolean; callbackUrl: string }) => {
  return (
    <>
      <div className={styles.box}>
        <h2>{test ? "Avec ProConnect de test" : "Avec mon accès ProConnect"}</h2>
        {!test && (
          <p className={styles.description}>
            Je suis une entreprise française avec un numéro SIRET et un accès France connect (pour les entreprises de
            moins de 50 salariés)
          </p>
        )}
        <ProConnectButton
          onClick={() => {
            track("Login", "ProConnect", "ProConnect")
            signIn("proconnect", { callbackUrl })
          }}
        />
      </div>
      {!test && (
        <div className={styles.box}>
          <ProCredentials as='h2' />
        </div>
      )}
    </>
  )
}

export default LoginForm
