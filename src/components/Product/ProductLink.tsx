"use client"

import Button from "@codegouvfr/react-dsfr/Button"
import styles from "./ProductLink.module.css"
import { Products } from "../../db/product"
import { useSearchParams } from "next/navigation"

const ProductLink = ({
  product,
  version,
  brandId,
}: {
  product: Products[number]
  version?: string
  brandId?: string
}) => {
  const params = useSearchParams()
  return (
    <Button
      priority='secondary'
      size='small'
      linkProps={{
        href: brandId
          ? `/marques/${brandId}/${product.gtins[0]}${version ? `/${version}` : ""}?${params.toString()}`
          : `/produits/${product.gtins[0]}${version ? `/${version}` : ""}?${params.toString()}`,
      }}
      key={product.id}
      className={styles.displayButton}>
      Voir le détail
    </Button>
  )
}

export default ProductLink
