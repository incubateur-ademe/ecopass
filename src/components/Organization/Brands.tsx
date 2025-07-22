"use client"

import Button from "@codegouvfr/react-dsfr/Button"
import Table from "../Table/Table"
import styles from "./Brands.module.css"
import { deleteBrand } from "../../serverFunctions/brand"
import { useRouter } from "next/navigation"

const Brands = ({ brands }: { brands: { id: string; name: string }[] }) => {
  const router = useRouter()

  return (
    <Table
      fixed
      caption='Mes marques'
      noCaption
      headers={["Nom", ""]}
      data={brands.map((brand) => [
        <span key={brand.id} data-testid='brand-row-name'>
          {brand.name}
        </span>,
        <div key={brand.id} className={styles.button}>
          <Button
            iconId='fr-icon-delete-bin-fill'
            onClick={() =>
              deleteBrand(brand.id).then(() => {
                router.refresh()
              })
            }>
            Supprimer
          </Button>
        </div>,
      ])}
    />
  )
}

export default Brands
