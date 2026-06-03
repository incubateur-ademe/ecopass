"use client"
import { useState } from "react"
import SearchInput from "../Search/SearchInput"

const Search = ({ withoutHint }: { withoutHint?: boolean }) => {
  const [gtin, setGTIN] = useState("")
  return (
    <SearchInput
      label='Chercher un produit par code-barres (8 ou 13 chiffres)'
      stateRelatedMessage={
        withoutHint
          ? undefined
          : "Le contenu du portail est fourni par les  marques textiles. Le service étant récent, tous les produits ne sont pas encore disponibles."
      }
      value={gtin}
      onChange={setGTIN}
      onSearch={() => (window.location.href = `/produits/${gtin}`)}
      searchButtonHref={`/produits/${gtin}`}
      advancedSearchHref={`/recherche?search=${gtin}`}
    />
  )
}

export default Search
