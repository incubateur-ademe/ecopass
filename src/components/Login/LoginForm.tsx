"use client"
import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import Input from "@codegouvfr/react-dsfr/Input"
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useCallback, useState } from "react"
import styles from "./LoginForm.module.css"
import Button from "@codegouvfr/react-dsfr/Button"
import classNames from "classnames"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { track } from "../../utils/matomo"

const LoginForm = () => {
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
      <div className={styles.box}>
        <h3>Avec mon accès ProConnect</h3>
        <p className={styles.description}>
          Je suis une entreprise française avec un numéro siret et un accès France connect (pour les entreprises de
          moins de 50 salariés)
        </p>
        <ProConnectButton
          onClick={() => {
            track("Login", "ProConnect", "ProConnect")
            signIn("proconnect", { callbackUrl: "/" })
          }}
        />
      </div>
      <Tabs
        className='fr-mt-4w'
        tabs={[
          {
            label: "Créer un accès",
            isDefault: true,
            content: (
              <>
                <h3 className={styles.title}>Je n’ai pas d’accès ProConnect</h3>
                <p className={styles.description}>
                  Vous n’avez pas de siret ou/et pas de compte France connect, remplissez ce formulaire pour fournir les
                  pièces nécessaires à la création de votre espace.
                </p>
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
                <form id='login-1760' onSubmit={submit}>
                  <fieldset
                    className='fr-fieldset'
                    id='login-1760-fieldset'
                    aria-labelledby='login-1760-fieldset-legend login-1760-fieldset-messages'>
                    <legend id='login-1760-fieldset-legend'>
                      <h2 className={styles.title}>Je n’ai pas d’accès ProConnect</h2>
                      <p className={styles.description}>
                        Vous n'avez pas d'accès ProConnect, vous avez fait une demande d’accès, utilisez l'accès qui
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
                      error === "proconnect"
                        ? "Vous essayez de vous connecter avec un compte ProConnect, veuillez utiliser le bouton de connexion ProConnect ci dessus."
                        : "Une erreur est survenue lors de la connexion. Veuillez vérifier vos identifiants et réessayer."
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

export default LoginForm
