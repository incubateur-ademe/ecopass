import styles from "./BrandHeader.module.css"
import Link from "next/link"
import { BrandInformation } from "../../db/brands"
import ProductsList from "../Product/ProductsList"
import AdminForm from "../Organization/AdminForm"

const BrandHeader = ({ brand, isAdmin }: { brand: BrandInformation; isAdmin: boolean }) => {
  const productCount = brand.productsByCategory.reduce((acc, category) => acc + category.count, 0)
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.info}>
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
          {isAdmin && (
            <p className={styles.subtitle}>
              {brand.noGTIN === true
                ? "Cette marque est sans GTIN."
                : brand.noGTIN === false
                  ? "Cette marque utilise des GTIN."
                  : brand.organization?.noGTIN
                    ? "Cette marque fait partie d'organisation sans GTIN."
                    : "Cette marque fait partie d'organisation avec GTIN."}
            </p>
          )}
        </div>
        {isAdmin && brand.organization && <AdminForm mode='brand' id={brand.id} noGTIN={brand.noGTIN} />}
      </div>
      {brand.productsByCategory.length > 0 && <ProductsList productsByCategory={brand.productsByCategory} />}
    </div>
  )
}

export default BrandHeader
