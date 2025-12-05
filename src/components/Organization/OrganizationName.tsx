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
      if (text) {
        updateDisplayName(text)
      }
    }

    const debounce = setTimeout(() => {
      update()
    }, 300)

    return () => clearTimeout(debounce)
  }, [text])
  return (
    <Input
      className={styles.input}
      label="Nom d'usage"
      hintText='Le nom qui apparaitra comme dépositaire sur vos déclaration'
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
