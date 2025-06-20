import Button from "@codegouvfr/react-dsfr/Button"
import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"

type HomeBannerProps = {
  withConnection?: boolean
}

const HomeBanner = ({ withConnection = true }: HomeBannerProps) => {
  return (
    <>
      <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle'>
        <div className='fr-col-12 fr-col-md-6'>
          <h1 className={styles.title}>Déclarez le coût environnemental de vos produits textiles</h1>
          {withConnection && (
            <Button
              linkProps={{ href: "/login" }}
              iconId='fr-icon-arrow-right-line'
              iconPosition='right'
              size='large'
              className='fr-mt-8w'>
              Se connecter
            </Button>
          )}
        </div>
        <Image
          className={classNames("fr-col-12 fr-col-md-6", styles.image, { [styles.small]: !withConnection })}
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
