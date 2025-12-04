"use client"
import Alert from "@codegouvfr/react-dsfr/Alert"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import { useState } from "react"

const Search = ({ withAlert }: { withAlert?: boolean }) => {
  const [gtin, setGTIN] = useState("")
  return (
    <>
      <div className='fr-mt-4w'>
        {withAlert ? (
          <Alert
            severity='info'
            className='fr-mb-2w'
            title='Ce site est en construction'
            description="Le contenu du portail d'affichage environnemental est fourni par les marques de textiles. Comme le service vient tout juste d'être lancé, il se peut que certains produits ne soient pas encore disponibles lors de votre recherche."
          />
        ) : (
          <h2>Cherchez un autre produit</h2>
        )}
      </div>
      <p>Saisissez le code-barres du produit recherché (8 ou 13 chiffres)</p>
      <div className='fr-grid-row fr-grid-row--gutters'>
        <Input
          className='fr-col-12 fr-col-sm-9 fr-mb-0'
          label='Code-barres'
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
      </div>
      <div className='fr-btns-group--inline fr-mt-2w'>
        <Button linkProps={{ href: `/produits/${gtin}`, prefetch: false }} iconId='ri-search-line'>
          Rechercher
        </Button>
        <Button linkProps={{ href: `/recherche?search=${gtin}` }} priority='secondary' iconId='ri-settings-line'>
          Recherche avancée
        </Button>
      </div>
    </>
  )
}

export default Search
