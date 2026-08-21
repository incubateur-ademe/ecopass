"use client"

import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import styles from "./LoginForm.module.css"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { track } from "../../utils/matomo"
import classNames from "classnames"
import { useRouter } from "next/navigation"
import { FormEvent, useCallback, useState } from "react"
import { signIn } from "next-auth/react"
import { Input } from "@codegouvfr/react-dsfr/Input"
import Link from "next/link"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { messages } from "./messages"

const CitoyenCredentials = () => {
  const router = useRouter()
  const [error, setError] = useState("")

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email")
      const password = formData.get("password")
      if (email && password) {
        setError("")
        track("Login", "Credentials", "Credentials")
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (!result?.error) {
          track("Login", "Credentials", "Success")
          router.refresh()
        } else {
          if (result.error === "proconnect") {
            track("Login", "Credentials", "Error ProConnect")
          } else if (result.error === "franceconnect") {
            track("Login", "Credentials", "Error FranceConnect")
          } else {
            track("Login", "Credentials", "Error")
          }
          setError(result.error)
        }
      }
    },
    [router],
  )
  return (
    <>
      <h3 className={styles.title}>Je n’ai pas d’accès FranceConnect</h3>
      <Tabs
        className='fr-mt-4w'
        tabs={[
          {
            label: "Créer un accès",
            isDefault: true,
            content: (
              <>
                <Button
                  className={classNames("fr-mt-4w", styles.button)}
                  linkProps={{
                    href: "https://demarche.numerique.gouv.fr/commencer/registration-of-companies-without-a-siret-number-o",
                    onClick: () => track("Login", "Credentials", "Create account"),
                  }}>
                  Je crée mon compte
                </Button>
              </>
            ),
          },
          {
            label: "Connexion",
            content: (
              <>
                <form id='login-1761' onSubmit={submit}>
                  <fieldset
                    className='fr-fieldset'
                    id='login-1761-fieldset'
                    aria-labelledby='login-1761-fieldset-legend login-1761-fieldset-messages'>
                    <legend id='login-1761-fieldset-legend'>
                      <p className={styles.description}>
                        Vous n'avez pas d'accès FranceConnect, vous avez fait une demande d’accès, utilisez l'accès qui
                        vous a été créé. Tous les champs sont obligatoires.
                      </p>
                    </legend>
                    <div className='fr-fieldset__element'>
                      <fieldset className='fr-fieldset'>
                        <div className='fr-fieldset__element'>
                          <Input
                            className={styles.input}
                            label='Email'
                            hintText='Format attendu : nom@domaine.fr'
                            nativeInputProps={{
                              required: true,
                              type: "email",
                              name: "email",
                            }}
                          />
                        </div>
                        <div className='fr-fieldset__element'>
                          <Input
                            className={styles.input}
                            label='Mot de passe'
                            nativeInputProps={{
                              required: true,
                              type: "password",
                              name: "password",
                            }}
                          />
                        </div>
                        <div className='fr-fieldset__element'>
                          <p>
                            <Link
                              href='/forget-password'
                              className={classNames("fr-link", styles.link)}
                              prefetch={false}>
                              Mot de passe oublié ?
                            </Link>
                          </p>
                        </div>
                      </fieldset>
                    </div>
                    <Button className={styles.button} type='submit'>
                      Se connecter
                    </Button>
                  </fieldset>
                </form>
                {error && (
                  <Alert
                    className='fr-mt-4w'
                    title={
                      messages[error] ||
                      "Une erreur est survenue lors de la connexion. Veuillez vérifier vos identifiants et réessayer."
                    }
                    severity='error'
                  />
                )}
              </>
            ),
          },
        ]}
      />
    </>
  )
}

export default CitoyenCredentials
