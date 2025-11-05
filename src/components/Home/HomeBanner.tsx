"use client"
import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"
import ProConnectButton from "@codegouvfr/react-dsfr/ProConnectButton"
import { signIn } from "next-auth/react"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { isTestEnvironment } from "../../utils/test"

type HomeBannerProps = {
  withConnection?: boolean
}

const HomeBanner = ({ withConnection = true }: HomeBannerProps) => {
  return (
    <div className={classNames(styles.banner, { [styles.bannerTest]: isTestEnvironment() })}>
      <div>
        <h1 className={styles.title}>
          {isTestEnvironment()
            ? "Serveur de test pour la déclaration du coût environnemental de vos produits textiles"
            : "Déclarez le coût environnemental de vos produits textiles"}
        </h1>
        {withConnection && (
          <>
            {!isTestEnvironment() && (
              <p className={styles.description}>
                Vous êtes une marque ou un bureau d'études ?
                <br />
                Connectez-vous avec ProConnect pour déclarer le coût environnemental de vos produits.
              </p>
            )}
            <ProConnectButton onClick={() => signIn("proconnect", { callbackUrl: "/" })} />
          </>
        )}
      </div>
      {isTestEnvironment() ? (
        <Alert
          className={styles.alert}
          title='Bienvenue sur ce serveur bac à sable'
          severity='info'
          description={
            <>
              <span>Ici, vous pourrez :</span>
              <br />
              <span>
                <span className='fr-icon-arrow-right-s-fill' aria-hidden='true' /> comprendre le fonctionnement du
                portail avec des fichiers d’exemple,
              </span>
              <br />
              <span>
                <span className='fr-icon-arrow-right-s-fill' aria-hidden='true' /> tester la qualité de vos futures
                déclarations.
              </span>
              <br />
              <br />
              <span>
                <b>Aucune de vos saisies ne sera transférée sur le serveur de production.</b>
              </span>
              <br />
              <span>
                <b>Vos données de test seront automatiquement supprimées sous 7 jours</b>
              </span>
            </>
          }
        />
      ) : (
        <Image
          className={classNames(styles.image, { [styles.small]: !withConnection })}
          src='/images/tshirt.jpg'
          alt=''
          width={384}
          height={386}
        />
      )}
    </div>
  )
}

export default HomeBanner
