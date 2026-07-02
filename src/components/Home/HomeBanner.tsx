import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { isTestEnvironment } from "../../utils/test"
import ProConnect from "../Button/ProConnect"
import Link from "next/link"
import Block from "../Block/Block"
import { Tile } from "@codegouvfr/react-dsfr/Tile"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import LastBrands from "./LastBrands"

const HomeBanner = ({
  connected,
  isAllowedToDeclare,
  isPro,
}: {
  connected?: boolean
  isAllowedToDeclare: boolean
  isPro?: boolean
}) => {
  const proView = isPro || isAllowedToDeclare
  return (
    <Block
      large
      type='yellow'
      className={proView ? "" : styles.background}
      containerClassName={proView ? styles.proBackground : ""}>
      <div
        className={classNames(styles.banner, {
          [styles.bannerTest]: isTestEnvironment(),
          [styles.bannerPro]: proView,
        })}>
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
          !proView && (
            <Image
              className={classNames(styles.image, { [styles.small]: connected })}
              src='/images/etiquette.svg'
              alt=''
              width={378}
              height={188}
            />
          )
        )}
        <div>
          <h1>
            {isTestEnvironment()
              ? "Serveur de test pour la déclaration du coût environnemental de vos produits textiles"
              : proView
                ? "Déclarez le coût environnemental de vos produits textiles"
                : "Affichage environnemental"}
          </h1>
          {!isTestEnvironment() &&
            (proView ? (
              !connected && (
                <>
                  <p className={styles.description}>
                    Vous êtes une marque ou un bureau d'études ?
                    <br />
                    Connectez-vous avec ProConnect pour déclarer le coût environnemental de vos produits.
                  </p>
                  <Alert
                    small
                    className='fr-mb-4w'
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
                  <ProConnect />
                </>
              )
            ) : (
              <>
                <p className={styles.description}>
                  Réglettes, équivalences, valeurs médianes.. porté par le Gouvernement, l’affichage environnemental
                  développe pour les entreprises, des outils qui s’ajoutent à vos sites et applications en quelques
                  clics. 100% gratuit.
                </p>
                <div className={styles.brands}>
                  <LastBrands />
                </div>
              </>
            ))}
        </div>
      </div>
      {connected && isAllowedToDeclare && (
        <div className='fr-grid-row fr-grid-row--gutters fr-mt-3w'>
          <div className='fr-col-12 fr-col-lg-4'>
            <Tile
              orientation='horizontal'
              start={<Badge>Organisation</Badge>}
              title='Gérez votre entreprise'
              imageUrl='/images/catalog.svg'
              imageAlt=''
              titleAs='h2'
              desc='Listez vos marques et organisez vos délégations.'
              linkProps={{ href: "/organisation" }}
            />
          </div>
          <div className='fr-col-12 fr-col-lg-4'>
            <Tile
              orientation='horizontal'
              start={<Badge>dépôt officiel</Badge>}
              title='Déclarer vos produits'
              imageUrl='/images/contract.svg'
              imageAlt=''
              titleAs='h2'
              desc={
                <>
                  Déclarez <b>officiellement</b> vos produits et suivez leur statut.
                </>
              }
              linkProps={{ href: "/declarations" }}
            />
          </div>
          <div className='fr-col-12 fr-col-lg-4'>
            <Tile
              orientation='horizontal'
              start={<Badge>produits</Badge>}
              title='Consulter vos produits'
              imageUrl='/images/search.svg'
              imageAlt=''
              titleAs='h2'
              desc='Retrouvez ici tous vos produits déclarés.'
              linkProps={{ href: "/produits" }}
            />
          </div>
        </div>
      )}
    </Block>
  )
}

export default HomeBanner
