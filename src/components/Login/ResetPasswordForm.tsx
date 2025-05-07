"use client"

import { Alert } from "@codegouvfr/react-dsfr/Alert"
import Block from "../../components/Block/Block"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup"
import { FormEvent, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { changePassword } from "../../serverFunctions/user"
import { validatePassword } from "../../services/auth/password"

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [error, setError] = useState("")
  const [weakPassword, setWeakPassword] = useState(false)
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState(false)

  const router = useRouter()

  const submit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setWeakPassword(false)
    setPasswordDoesNotMatch(false)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")
    if (email && confirmPassword && password) {
      const validation = validatePassword(password.toString())
      if (Object.values(validation).some((value) => value !== true)) {
        setWeakPassword(true)
        return
      }

      if (password.toString() !== confirmPassword.toString()) {
        setPasswordDoesNotMatch(true)
        return
      }

      const result = await changePassword(email.toString(), token, password.toString())
      if (result) {
        setError(result)
      } else {
        router.push("/")
      }
    }
  }, [])

  return (
    <Block className='fr-grid-row fr-grid-row--center'>
      <div className='fr-col-12 fr-col-md-8 fr-col-lg-6'>
        <form onSubmit={submit}>
          <fieldset className='fr-fieldset' aria-labelledby='legend'>
            <legend className='fr-fieldset__legend' id='legend'>
              <h1>Nouveau mot de passe</h1>
            </legend>
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
                    hintText='Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre'
                    state={weakPassword ? "error" : undefined}
                    stateRelatedMessage={
                      weakPassword ? "Le mot de passe ne respecte pas les conditions de sécurité" : undefined
                    }
                    nativeInputProps={{
                      required: true,
                      type: "password",
                      name: "password",
                    }}
                  />
                </div>
                <div className='fr-fieldset__element'>
                  <Input
                    label='Confirmation'
                    state={passwordDoesNotMatch ? "error" : undefined}
                    stateRelatedMessage={passwordDoesNotMatch ? "Les mots de passe sont différents" : undefined}
                    nativeInputProps={{
                      required: true,
                      type: "password",
                      name: "confirmPassword",
                    }}
                  />
                </div>
              </fieldset>
            </div>
            <div className='fr-fieldset__element'>
              <ButtonsGroup
                buttons={[
                  {
                    children: "Changer le mot de passe",
                    type: "submit",
                  },
                ]}
              />
            </div>
          </fieldset>
          {error && <Alert severity='error' title='Erreur lors du changement de mot de passe' description={error} />}
        </form>
      </div>
    </Block>
  )
}

export default ResetPasswordForm
