"use server"

import Badge from "@codegouvfr/react-dsfr/Badge"
import { getLastBrands } from "../../db/product"
import styles from "./LastBrands.module.css"

const LastBrands = async () => {
  const brands = await getLastBrands()
  return (
    <>
      <h2>Les 5 dernières marques à avoir déclaré</h2>
      <div className={styles.brands}>
        {brands.map((brand) => (
          <Badge className={styles.brand} key={brand.id}>
            {brand.name}
          </Badge>
        ))}
      </div>
    </>
  )
}

export default LastBrands
