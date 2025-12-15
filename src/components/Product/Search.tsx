"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import { useState } from "react"
import styles from "./Search.module.css"

const Search = ({ withAlert }: { withAlert?: boolean }) => {
  const [gtin, setGTIN] = useState("")
  return (
    <div className={styles.box}>
      <Input
        className={styles.input}
        label='Chercher un produit par code-barres (8 ou 13 chiffres)'
        stateRelatedMessage='Le contenu du portail est fourni par les  marques textiles. Le service étant récent, tous les produits ne sont pas encore disponibles.'
        state='info'
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
      <div className={styles.buttons}>
        <Button linkProps={{ href: `/produits/${gtin}`, prefetch: false }} iconId='ri-search-line'>
          Rechercher
        </Button>
        <Button linkProps={{ href: `/recherche?search=${gtin}` }} priority='secondary' iconId='ri-settings-line'>
          Recherche avancée
        </Button>
      </div>
    </div>
  )
}

export default Search
