"use client"
import Input from "@codegouvfr/react-dsfr/Input"
import { UserOrganization } from "../../db/user"
import styles from "./OrganizationName.module.css"
import { useEffect, useState } from "react"
import { updateDisplayName } from "../../serverFunctions/organization"

const OrganizationName = ({ organization }: { organization: UserOrganization }) => {
  const [text, setText] = useState(organization.displayName)
  useEffect(() => {
    const update = () => {
      if (text && text !== organization.displayName) {
        updateDisplayName(text)
      }
    }

    const debounce = setTimeout(() => {
      update()
    }, 300)

    return () => clearTimeout(debounce)
  }, [text, organization.displayName])

  return (
    <Input
      className={styles.input}
      label="Nom d'usage"
      hintText='Le nom qui apparaîtra comme dépositaire sur vos déclarations'

      nativeInputProps={{
        value: text,
        onChange: (event) => {
          setText(event.target.value)
        },
      }}
    />
  )
}

export default OrganizationName
