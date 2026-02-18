"use client"
import { FormEvent, useState } from "react"
import Input from "@codegouvfr/react-dsfr/Input"
import Select from "@codegouvfr/react-dsfr/Select"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { createUserAndOrganization } from "../../serverFunctions/admin"
import styles from "./CreateUserForm.module.css"
import LoadingButton from "../Button/LoadingButton"
import { OrganizationType } from "@prisma/enums"

const CreateUserForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const organizationName = formData.get("organizationName") as string
    const organizationType = formData.get("organizationType") as OrganizationType

    if (!email || !organizationName || !organizationType) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)

    try {
      const result = await createUserAndOrganization(email, organizationName.trim(), organizationType)

      if ("error" in result && result.error) {
        setError(result.error)
      } else if ("success" in result && "message" in result) {
        setSuccess(result.message || "Utilisateur créé avec succès")
        ;(event.target as HTMLFormElement).reset()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création de l'utilisateur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.container}>
        {error && <Alert title='Erreur' severity='error' small description={error} className='fr-mb-4w' />}
        {success && <Alert title='Succès' severity='success' small description={success} className='fr-mb-4w' />}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label='Adresse email'
            nativeInputProps={{
              type: "email",
              name: "email",
              required: true,
              disabled: loading,
            }}
          />

          <Input
            label="Nom de l'organisation"
            nativeInputProps={{
              type: "text",
              name: "organizationName",
              required: true,
              disabled: loading,
            }}
          />

          <Select
            label="Type d'organisation"
            nativeSelectProps={{
              name: "organizationType",
              required: true,
              disabled: loading,
            }}>
            <option value=''>-- Sélectionner un type --</option>
            <option value={OrganizationType.Brand}>Marque</option>
            <option value={OrganizationType.Distributor}>Distributeur</option>
            <option value={OrganizationType.BrandAndDistributor}>Marque et Distributeur</option>
            <option value={OrganizationType.Consultancy}>Bureau d'études</option>
            <option value={OrganizationType.Other}>Autre</option>
          </Select>

          <LoadingButton className={styles.button} type='submit' loading={loading}>
            Créer l'utilisateur
          </LoadingButton>
        </form>
      </div>
    </>
  )
}

export default CreateUserForm
