import Image from "next/image"
import styles from "./BrandHeader.module.css"
import { productMapping } from "../../utils/ecobalyse/mappings"
import Link from "next/link"
import { BrandInformation } from "../../db/brands"

const BrandHeader = ({ productCount, brand }: { brand: BrandInformation; productCount: number }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.header}>
        <h1 className={styles.title}>{brand.name}</h1>
        {productCount > 0 && (
          <p className={styles.subtitle}>
            Cette marque a déclaré <strong>{productCount.toLocaleString("fr-FR")}</strong> référence
            {productCount > 1 ? "s" : ""} produit.
          </p>
        )}
        <p className={styles.subtitle}>
          {productCount > 0 ? "Elle" : "Cette marque"} appartient à l'organisation{" "}
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
      </div>
      {brand.productsByCategory.length > 0 && (
        <div className={styles.categoriesPreview}>
          {brand.productsByCategory.map((category) => (
            <div className={styles.categoryPreviewItem} key={category.slug}>
              <Image
                src={`/icons/${productMapping[category.slug]}.svg`}
                alt=''
                width={40}
                height={40}
                className={styles.categoryPreviewIcon}
              />
              <p className={styles.categoryPreviewLabel}>{category.slug}</p>
              <p className={styles.categoryPreviewCount}>{category.count.toLocaleString("fr-FR")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BrandHeader
