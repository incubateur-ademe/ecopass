import styles from "./BrandHeader.module.css"
import Link from "next/link"
import { BrandInformation } from "../../db/brands"
import ProductsList from "../Product/ProductsList"

const BrandHeader = ({ productCount, brand }: { brand: BrandInformation; productCount: number }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.header}>
        <h1 className={styles.title}>{brand.name}</h1>
        {productCount > 0 ? (
          <p className={styles.subtitle}>
            Cette marque a déclaré <strong>{productCount.toLocaleString("fr-FR")}</strong> référence
            {productCount > 1 ? "s" : ""} produit.
          </p>
        ) : (
          <p className={styles.subtitle}>Cette marque n'a déclaré aucun produit.</p>
        )}
        {brand.organization && (
          <>
            <p className={styles.subtitle}>
              Elle appartient à l'organisation{" "}
              <Link href={`/organisations/${brand.organization.id}`}>{brand.organization.displayName}</Link>.
            </p>
            {brand.organization.authorizedOrganizations.length > 0 && (
              <p className={styles.subtitle}>
                Bureau d'études délégataire actif :{" "}
                {brand.organization.authorizedOrganizations
                  .flatMap((authOrg) => [
                    <Link key={authOrg.to.id} href={`/organisations/${authOrg.to.id}`}>
                      {authOrg.to.displayName}
                    </Link>,
                    ", ",
                  ])
                  .slice(0, -1)}
                .
              </p>
            )}
          </>
        )}
      </div>
      {brand.productsByCategory.length > 0 && <ProductsList productsByCategory={brand.productsByCategory} />}
    </div>
  )
}

export default BrandHeader
