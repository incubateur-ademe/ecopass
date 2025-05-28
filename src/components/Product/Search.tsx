"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import { useState } from "react"

const Search = () => {
  const [gtin, setGTIN] = useState("")
  return (
    <>
      <p>Veuillez rentrer le code GTIN du produit que vous cherchez</p>
      <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle'>
        <Input
          className='fr-col-12 fr-col-sm-9 fr-mb-0'
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
        <div className='fr-col-12 fr-col-sm-3 fr-mt-1w'>
          <Button linkProps={{ href: `/produits/${gtin}`, prefetch: false }}>Rechercher</Button>
        </div>
      </div>
    </>
  )
}

export default Search
