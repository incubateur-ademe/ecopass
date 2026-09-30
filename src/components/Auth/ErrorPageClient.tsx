"use client"

import { Alert } from "@codegouvfr/react-dsfr/Alert"
import Link from "next/link"
import Block from "../Block/Block"
import { useEffect } from "react"
import { performLogout } from "../../utils/auth/logoutHelpers"

const errorMessages: Record<string, { title: string; description: string }> = {
  credentials_conflict: {
    title: "Cet email est déjà enregistré avec un compte de connexion classique",
    description: "Veuillez utiliser la connexion avec votre email et votre mot de passe directement",
  },
  proconnect_conflict: {
    title: "Cet email est déjà enregistré avec un compte ProConnect",
    description: "Veuillez utiliser la connexion ProConnect",
  },
  franceconnect_conflict: {
    title: "Cet email est déjà enregistré avec un compte FranceConnect",
    description: "Veuillez utiliser la connexion FranceConnect",
  },
  Callback: {
    title: "La tentative de connexion a été annulée",
    description: "Veuillez réessayer si nécessaire",
  },
  conflict: {
    title: "Connexion impossible",
    description:
      "Vous possedez déjà un compte sur la plateforme avec cet email et un autre moyen de connexion. Veuillez l'utiliser directement ",
  },
}

const defaultError = {
  title: "La tentative de connexion a échoué",
  description: "Veuillez réessayer",
}
const ErrorPageClient = ({ error }: { error?: string }) => {
  const [errorCode, provider, idToken] = error?.split("|") || []

  useEffect(() => {
    if (!provider || !idToken) {
      return
    }

    if (
      errorCode === "credentials_conflict" ||
      errorCode === "proconnect_conflict" ||
      errorCode === "franceconnect_conflict"
    ) {
      const postLogoutUri = `${process.env.NEXT_PUBLIC_URL}/auth/error/conflit`
      performLogout(provider as "franceconnect" | "proconnect", postLogoutUri, idToken)
    }
  }, [errorCode, provider, idToken])

  const errorConfig = errorMessages[errorCode] || defaultError

  return (
    <Block>
      <Alert
        severity='error'
        title={errorConfig.title}
        description={
          <>
            {errorConfig.description} ou{" "}
            <Link
              href='mailto:affichage-environnemental@ecobalyse.beta.gouv.fr'
              target='_blank'
              rel='noopener noreferrer'>
              nous contacter
            </Link>{" "}
            si le problème persiste.
          </>
        }
      />
    </Block>
  )
}

export default ErrorPageClient
