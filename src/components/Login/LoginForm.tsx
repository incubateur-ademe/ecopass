"use client"

import Alert from "@codegouvfr/react-dsfr/Alert"
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup"
import Input from "@codegouvfr/react-dsfr/Input"
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useCallback, useState } from "react"
import styles from "./LoginForm.module.css"
import Button from "@codegouvfr/react-dsfr/Button"

const LoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState(false)

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email")
      const password = formData.get("password")
      if (email && password) {
        setError(false)
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (!result?.error) {
          router.refresh()
        } else {
          setError(true)
        }
      }
    },
    [router],
  )
  return (
    <>
      <h2 className={styles.title}>Se connecter</h2>
      <div className={styles.boxes}>
        <div className={styles.box}>
          <h3>Avec ProConnect</h3>
          <ProConnectButton onClick={() => signIn("proconnect", { callbackUrl: "/" })} />
        </div>
        <form id='login-1760' onSubmit={submit} className={styles.box}>
          <fieldset
            className='fr-fieldset'
            id='login-1760-fieldset'
            aria-labelledby='login-1760-fieldset-legend login-1760-fieldset-messages'>
            <legend id='login-1760-fieldset-legend'>
              <h3 className={styles.title}>Avec son compte</h3>
            </legend>
            <div className='fr-fieldset__element'>
              <fieldset className='fr-fieldset'>
                <div className='fr-fieldset__element'>
                  <span className='fr-hint-text'>Sauf mention contraire, tous les champs sont obligatoires.</span>
                </div>
                <div className='fr-fieldset__element'>
                  <Input
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
                    <Link href='/forget-password' className='fr-link' prefetch={false}>
                      Mot de passe oublié ?
                    </Link>
                  </p>
                </div>
              </fieldset>
            </div>
            <div className='fr-fieldset__element'>
              <ButtonsGroup
                buttons={[
                  {
                    children: "Se connecter",
                    type: "submit",
                  },
                ]}
              />
            </div>
          </fieldset>
        </form>
      </div>
      {error && (
        <Alert
          className='fr-mb-4w'
          title='Une erreur est survenue lors de la connexion. Veuillez vérifier vos identifiants et réessayer.'
          severity='error'
        />
      )}
      <div className={styles.box}>
        <h2>Vous n'avez pas de numéro SIRET ?</h2>
        <p>
          Nous vous invitons à remplir ce formulaire pour fournir les pièces nécessaires à la création de votre espace.
        </p>
        <Button
          className='fr-mt-2w'
          linkProps={{
            href: "https://demarche.numerique.gouv.fr/commencer/registration-of-companies-without-a-siret-number-o",
          }}>
          Je crée mon compte
        </Button>
      </div>
    </>
  )
}

export default LoginForm
