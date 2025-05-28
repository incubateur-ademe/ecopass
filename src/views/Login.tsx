"use client"

import Block from "../components/Block/Block"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup"
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
      <div className='fr-col-12 fr-col-md-8 fr-col-lg-6'>
        <form onSubmit={submit}>
          <fieldset className='fr-fieldset' aria-labelledby='legend'>
            <legend className='fr-fieldset__legend' id='legend'>
              <h1>Connexion</h1>
            </legend>
            <p className='fr-mb-4w'>
              Le portail de déclaration de l’affichage environnemental est actuellement en beta privé. Si vous
              rencontrez des difficultés à vous connecter, veuillez contacter l’équipe de l’affichage environnemental à
              cette adresse{" "}
              <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`} className='fr-link' prefetch={false}>
                {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
              </Link>
            </p>
            <div className='fr-fieldset__element'>
              <fieldset className='fr-fieldset'>
                <div className='fr-fieldset__element'>
                  <span className='fr-hint-text'>Sauf mention contraire, tous les champs sont obligatoires.</span>
                </div>
                <div className='fr-fieldset__element'>
                  <Input
                    label='Email'
                    hintText='Format attendu : nom@domaine.fr'
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
        {error && (
          <Alert
            title='Une erreur est survenue lors de la connexion. Veuillez vérifier vos identifiants et réessayer.'
            severity='error'
          />
        )}
      </div>
    </Block>
  )
}

export default Login
