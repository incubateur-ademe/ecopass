"use client"

import { useState } from "react"
import Button from "@codegouvfr/react-dsfr/Button"
import { Input } from "@codegouvfr/react-dsfr/Input"
import styles from "./ConverterGtinForm.module.css"

const ConverterGtinForm = ({ initialGtin }: { initialGtin?: string }) => {
  const [gtin, setGtin] = useState(initialGtin || "")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (gtin.trim()) {
      window.location.href = `/convertisseur?gtin=${gtin.trim()}`
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label='Code GTIN/EAN'
        hintText='Entrez un code GTIN ou EAN (8, 12 ou 13 chiffres)'
        nativeInputProps={{
          value: gtin,
          onChange: (e) => setGtin(e.currentTarget.value),
        }}
      />
      <Button type='submit' disabled={!gtin.trim()}>
        Rechercher
      </Button>
    </form>
  )
}

export default ConverterGtinForm
