"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import { useState } from "react"

const Search = () => {
  const [ean, setEan] = useState("")
  return (
    <>
      <p>Veuillez rentrer le code EAN du produit que vous chercher</p>
      <Input
        label='Code EAN'
        hideLabel
        nativeInputProps={{
          value: ean,
          onChange: (event) => setEan(event.target.value),
          onKeyDown: (event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              window.location.href = `/produits/${ean}`
            }
          },
        }}
      />
      <Button linkProps={{ href: `/produits/${ean}` }}>Rechercher</Button>
    </>
  )
}

export default Search
