import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { isTestEnvironment } from "../../utils/test"
import ProConnect from "../Button/ProConnect"
import Link from "next/link"

const HomeBanner = ({ withConnection = true, isPro }: { withConnection?: boolean; isPro?: boolean }) => {
  return (
    <div className={classNames(styles.banner, { [styles.bannerTest]: isTestEnvironment() })}>
      <div>
        <h1>
          {isTestEnvironment()
            ? "Serveur de test pour la déclaration du coût environnemental de vos produits textiles"
            : isPro
              ? "Déclarez le coût environnemental de vos produits textiles"
              : "Affichage environnemental"}
        </h1>
        {!isTestEnvironment() &&
          (isPro ? (
            withConnection && (
              <>
                <p className={styles.description}>
                  Vous êtes une marque ou un bureau d'études ?
                  <br />
                  Connectez-vous avec ProConnect pour déclarer le coût environnemental de vos produits.
                </p>
                <div className={styles.connection}>
                  <ProConnect />
                  <Alert
                    small
                    severity='info'
                    description={
                      <>
                        Vous n’avez pas de SIRET ? Nous vous invitons à remplir{" "}
                        <Link
                          className='fr-link'
                          href='https://demarche.numerique.gouv.fr/commencer/registration-of-companies-without-a-siret-number-o'>
                          ce questionnaire
                        </Link>{" "}
                        pour valider votre inscription.
                      </>
                    }
                  />
                </div>
              </>
            )
          ) : (
            <p className={styles.description}>
              Une mesure d'impact portée par le gouvernement, simple et comparable pour comprendre l'impact
              environnemental de vos vêtements.
            </p>
          ))}
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
          className={classNames(styles.image, { [styles.small]: !withConnection, [styles.round]: isPro })}
          src={isPro ? "/images/tshirt.jpg" : "/images/score.png"}
          alt=''
          width={378}
          height={188}
        />
      )}
    </div>
  )
}

export default HomeBanner
