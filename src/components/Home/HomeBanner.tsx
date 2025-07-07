"use client"
import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"

const HomeBanner = () => {
  return (
    <>
      <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle'>
        <div className='fr-col-12 fr-col-md-6'>
          <h1 className={styles.title}>Déclarez le coût environnemental de vos produits textiles</h1>
        </div>
        <Image
          className={classNames("fr-col-12 fr-col-md-6", styles.image)}
          src='/images/tshirt.jpg'
          alt=''
          width={400}
          height={400}
        />
      </div>
    </>
  )
}

export default HomeBanner
