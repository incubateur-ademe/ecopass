import Image from "next/image"
import styles from "./BrandHeader.module.css"
import { productMapping } from "../../utils/ecobalyse/mappings"
import { ProductCategory } from "../../types/Product"

const BrandHeader = ({
  name,
  lastDeclarationDate,
  productCount,
  categories,
}: {
  name: string
  lastDeclarationDate?: Date
  productCount: number
  categories: {
    slug: ProductCategory
    count: number
  }[]
}) => {
  return (
    <div className={styles.hero}>
      <div className={styles.header}>
        <h1 className={styles.title}>{name}</h1>
        {lastDeclarationDate && (
          <p className={styles.subtitle}>
            Cette marque a déclaré <strong>{productCount.toLocaleString("fr-FR")}</strong> produits.
          </p>
        )}
      </div>
      {categories.length > 0 && (
        <div className={styles.categoriesPreview}>
          {categories.map((category) => (
            <div className={styles.categoryPreviewItem} key={category.slug}>
              <Image
                src={`/icons/${productMapping[category.slug]}.svg`}
                alt=''
                width={48}
                height={48}
                className={styles.categoryPreviewIcon}
              />
              <span className={styles.categoryPreviewLabel}>{category.slug}</span>
              <span className={styles.categoryPreviewCount}>{category.count.toLocaleString("fr-FR")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BrandHeader
