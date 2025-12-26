"use client"
import Block from "../components/Block/Block"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup"
import { FormEvent, useCallback, useState } from "react"
import { resetPassword } from "../serverFunctions/user"
import Alert from "@codegouvfr/react-dsfr/Alert"

const ForgetPassword = () => {
  const [success, setSuccess] = useState(false)

  const submit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccess(false)
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    if (email) {
      resetPassword(email.toString()).then(() => setSuccess(true))
    }
  }, [])

  return (
    <Block className='fr-grid-row fr-grid-row--center'>
      {success ? (
        <Alert
          severity='success'
          title='Un lien de réinitialisation vous a été envoyé.'
          description="Si vous n'avez rien reçu, pensez à regarger vos spams"
        />
      ) : (
        <div className='fr-col-12 fr-col-md-8 fr-col-lg-6'>
          <form onSubmit={submit}>
            <fieldset className='fr-fieldset' aria-labelledby='legend'>
              <legend className='fr-fieldset__legend' id='legend'>
                <h1>Mot de passe oublié</h1>
              </legend>
              <p>
                Veuillez renseigner votre adresse email. Un lien de réinitialisation de mot de passe vous sera envoyé
                par email.
              </p>
              <div className='fr-fieldset__element fr-mt-4w'>
                <fieldset className='fr-fieldset'>
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
                </fieldset>
              </div>
              <div className='fr-fieldset__element'>
                <ButtonsGroup
                  buttons={[
                    {
                      children: "Envoyer",
                      type: "submit",
                    },
                  ]}
                />
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </Block>
  )
}

export default ForgetPassword
