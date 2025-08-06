"use client"

import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton"
import { signIn } from "next-auth/react"

type HomeBannerProps = {
  withConnection?: boolean
}

const HomeBanner = ({ withConnection = true }: HomeBannerProps) => {
  return (
    <div className={styles.banner}>
      <div>
        <h1 className={styles.title}>Déclarez le coût environnemental de vos produits textiles</h1>
        {withConnection && (
          <>
            <p className={styles.description}>
              Vous êtes une marque ou un bureau d'étude ?
              <br />
              Connectez vous avec ProConnect pour déclarer le coût environnemental de vos produits.
            </p>
            <ProConnectButton onClick={() => signIn("proconnect", { callbackUrl: "/" })} />
          </>
        )}
      </div>
      <Image
        className={classNames(styles.image, { [styles.small]: !withConnection })}
        src='/images/tshirt.jpg'
        alt=''
        width={384}
        height={386}
      />
    </div>
  )
}

export default HomeBanner
