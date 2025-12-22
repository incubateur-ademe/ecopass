"use client"

import Block from "../components/Block/Block"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup"
import { ProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton"
import { FormEvent, useCallback, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Alert from "@codegouvfr/react-dsfr/Alert"

const Login = () => {
  const router = useRouter()

  const [error, setError] = useState(false)

  const submit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
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
  }, [])

  return (
    <Block className='fr-grid-row fr-grid-row--center'>
      <div className='fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v'>
        <div className='fr-grid-row fr-grid-row-gutters fr-grid-row--center'>
          <div className='fr-col-12 fr-col-md-9 fr-col-lg-8'>
            <h1>Connexion</h1>
            <p className='fr-mb-4w'>
              Le portail de déclaration de l’affichage environnemental est actuellement en beta privé. Si vous
              rencontrez des difficultés à vous connecter, veuillez contacter l’équipe de l’affichage environnemental à
              cette adresse{" "}
              <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`} className='fr-link' prefetch={false}>
                {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
              </Link>
            </p>
            <div className='fr-mb-6v'>
              <h2>Se connecter avec ProConnect</h2>
              <ProConnectButton onClick={() => signIn("proconnect", { callbackUrl: "/" })} />
            </div>
            <p className='fr-hr-or'>ou</p>
            <div>
              <form id='login-1760' onSubmit={submit}>
                <fieldset
                  className='fr-fieldset'
                  id='login-1760-fieldset'
                  aria-labelledby='login-1760-fieldset-legend login-1760-fieldset-messages'>
                  <legend className='fr-fieldset__legend' id='login-1760-fieldset-legend'>
                    <h2>Se connecter avec son compte</h2>
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
          </div>
        </div>
      </div>
      {error && (
        <Alert
          title='Une erreur est survenue lors de la connexion. Veuillez vérifier vos identifiants et réessayer.'
          severity='error'
        />
      )}
    </Block>
  )
}

export default Login
