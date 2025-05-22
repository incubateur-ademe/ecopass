"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import { useState } from "react"

const Search = () => {
  const [gtin, setGTIN] = useState("")
  return (
    <>
      <p>Veuillez rentrer le code GTIN du produit que vous cherchez</p>
      <Input
        label='Code GTIN'
        hideLabel
        nativeInputProps={{
          value: gtin,
          onChange: (event) => setGTIN(event.target.value),
          onKeyDown: (event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              window.location.href = `/produits/${gtin}`
            }
          },
        }}
      />
      <Button linkProps={{ href: `/produits/${gtin}`, prefetch: false }}>Rechercher</Button>
    </>
  )
}

export default Search
