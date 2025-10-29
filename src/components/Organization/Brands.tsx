"use client"

import Button from "@codegouvfr/react-dsfr/Button"
import Table from "../Table/Table"
import { deleteBrand } from "../../serverFunctions/brand"
import { useRouter } from "next/navigation"
import Alert from "@codegouvfr/react-dsfr/Alert"

const Brands = ({ brands }: { brands: { id: string; name: string }[] }) => {
  const router = useRouter()

  return (
    <>
      <Alert
        severity='warning'
        title='Attention'
        description='Pour une identification uniforme des marques, veuillez désormais utiliser l’ID de la marque dans vos dépôts (colonne C du CSV).'
      />
      <Table
        fixed
        caption='Mes marques'
        noCaption
        headers={["Marque", "ID de la marque", "Action"]}
        data={brands.map((brand) => [
          <span key={brand.id} data-testid='brand-row-name'>
            {brand.name}
          </span>,
          <span key={brand.id}>{brand.id}</span>,
          <Button
            key={brand.id}
            iconId='fr-icon-delete-bin-fill'
            onClick={() =>
              deleteBrand(brand.id).then(() => {
                router.refresh()
              })
            }>
            Supprimer
          </Button>,
        ])}
      />
    </>
  )
}

export default Brands
