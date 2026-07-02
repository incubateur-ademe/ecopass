"use client"

import { track } from "../../utils/matomo"
import { signIn } from "next-auth/react"
import styles from "./LoginForm.module.css"
import { ProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton"
import { FranceConnectButton } from "@codegouvfr/react-dsfr/FranceConnectButton"

const PublicLoginForm = () => {
  return (
    <>
      <div className={styles.box}>
        <h3>Vous souhaitez déclarer en tant que citoyen ?</h3>
        <p className={styles.description}>
          Via l’outil France Connect. Votre identité reste connue de la plateforme mais sera non visible du grand
          public, vous déclarez en tant que “citoyen”.
        </p>
        <FranceConnectButton
          onClick={() => {
            track("Login", "FranceConnect", "FranceConnect")
            signIn("franceconnect", { callbackUrl: "/" })
          }}
        />
      </div>
      <div className={styles.box}>
        <h3>Vous souhaitez déclarer en tant que professionnel ?</h3>
        <p className={styles.description}>
          Je suis une entreprise française avec un numéro SIRET et un accès France connect (pour les entreprises de
          moins de 50 salariés)
        </p>
        <ProConnectButton
          onClick={() => {
            track("Login", "ProConnect", "ProConnect")
            signIn("proconnect", { callbackUrl: "/" })
          }}
        />
      </div>
    </>
  )
}

export default PublicLoginForm
