import Image from "next/image"
import { ProductCategory } from "../../types/Product"
import { getProductIcon } from "../../utils/product/category"
import styles from "./ProductsList.module.css"

const ProductsList = ({ productsByCategory }: { productsByCategory: { slug: ProductCategory; count: number }[] }) => {
  return (
    <div className={styles.categoriesPreview}>
      {productsByCategory.map((category) => (
        <div className={styles.categoryPreviewItem} key={category.slug}>
          <Image
            src={`/icons/${getProductIcon(category.slug)}.svg`}
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
  )
}

export default ProductsList
