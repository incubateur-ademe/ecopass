"use client"

import { track } from "../../utils/matomo"
import { signIn } from "next-auth/react"
import styles from "./LoginForm.module.css"
import { ProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton"
import { FranceConnectButton } from "@codegouvfr/react-dsfr/FranceConnectButton"
import ProCredentials from "./ProCredentials"
import CitoyenCredentials from "./CitoyenCredentials"

const PublicLoginForm = ({ test, callbackUrl }: { test?: boolean; callbackUrl: string }) => {
  return (
    <>
      <div className={styles.box}>
        <h2>Vous souhaitez déclarer en tant que citoyen ?</h2>
        <p className={styles.description}>
          Via l’outil France Connect. Votre identité reste connue de la plateforme mais sera non visible du grand
          public, vous déclarez en tant que “citoyen”.
        </p>
        <FranceConnectButton
          onClick={() => {
            track("Login", "FranceConnect", "FranceConnect")
            signIn("franceconnect", { callbackUrl })
          }}
        />
        {!test && (
          <div className='fr-mt-8w'>
            <CitoyenCredentials />
          </div>
        )}
      </div>
      <div className={styles.box}>
        <h2>Vous souhaitez déclarer en tant que professionnel ?</h2>
        <p className={styles.description}>
          Je suis une entreprise française avec un numéro SIRET et un accès France connect (pour les entreprises de
          moins de 50 salariés)
        </p>
        <ProConnectButton
          onClick={() => {
            track("Login", "ProConnect", "ProConnect")
            signIn("proconnect", { callbackUrl })
          }}
        />
        {!test && (
          <div className='fr-mt-8w'>
            <ProCredentials />
          </div>
        )}
      </div>
    </>
  )
}

export default PublicLoginForm
