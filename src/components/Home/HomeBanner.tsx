import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { isTestEnvironment } from "../../utils/test"
import ProConnect from "../Button/ProConnect"
import Link from "next/link"
import Block from "../Block/Block"
import LastBrands from "./LastBrands"
import { Tile } from "@codegouvfr/react-dsfr/Tile"
import { UserType } from "@prisma/client"
import { Badge } from "@codegouvfr/react-dsfr/Badge"

const HomeBanner = ({
  connected,
  isAllowedToDeclare,
  isPro,
  userType,
}: {
  connected?: boolean
  isAllowedToDeclare: boolean
  isPro?: boolean
  userType?: UserType
}) => {
  const proView = isPro || isAllowedToDeclare
  return (
    <Block
      large
      type='yellow'
      className={proView || connected ? "" : styles.background}
      containerClassName={proView && !connected ? styles.proBackground : ""}>
      <div
        className={classNames(styles.banner, {
          [styles.bannerTest]: isTestEnvironment(),
          [styles.bannerPro]: proView && !connected,
          [styles.bannerConnected]: connected,
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
          !proView &&
          !connected && <Image className={styles.image} src='/images/etiquette.svg' alt='' width={378} height={188} />
        )}
        <div>
          <h1>
            {isTestEnvironment()
              ? "Serveur de test pour la déclaration du coût environnemental de produits textiles"
              : proView
                ? "Déclarer le coût environnemental de vos produits textiles"
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
            ) : connected ? (
              <p className={styles.description}>
                Contribuer à enrichir la base de données en ajoutant vous-même les références encore absentes.
              </p>
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
          {connected && isAllowedToDeclare && (
            <div className={styles.tiles}>
              <Tile
                orientation='horizontal'
                title='Gérer votre entreprise'
                imageUrl='/images/catalog.svg'
                imageAlt=''
                titleAs='h2'
                desc='Listez vos marques et organisez vos délégations'
                linkProps={{ href: "/organisation" }}
                start={<Badge>ORGANISATION</Badge>}
              />
              <Tile
                orientation='horizontal'
                title='Déclarer vos produits'
                imageUrl='/images/contract.svg'
                imageAlt=''
                titleAs='h2'
                desc='Déclarez officiellement vos produits et suivez leur statut'
                linkProps={{ href: "/declarations" }}
                start={<Badge>DÉPÔT OFFICIEL</Badge>}
              />
              <Tile
                orientation='horizontal'
                title='Consulter vos produits'
                imageUrl='/images/search.svg'
                imageAlt=''
                titleAs='h2'
                desc='Retrouvez ici tous vos produits déclarés'
                linkProps={{ href: "/produits" }}
                start={<Badge>PRODUITS</Badge>}
              />
            </div>
          )}
          {connected && userType === UserType.CITOYEN && (
            <div className={styles.tiles}>
              <Tile
                orientation='horizontal'
                title='Déclarer des produits un par un via un formulaire simplifié'
                imageUrl='/images/conclusion.svg'
                imageAlt=''
                titleAs='h2'
                desc='L’essentiel pour une déclaration'
                linkProps={{ href: "/declaration-simplifiee" }}
                start={<Badge>DÉCLARATION SIMPLIFIÉE</Badge>}
              />
              <Tile
                orientation='horizontal'
                title='Comment trouver les informations nécessaires à la déclaration de données'
                imageUrl='/images/document-search.svg'
                imageAlt=''
                titleAs='h2'
                desc='Consultez le centre d’aide - Docs'
                linkProps={{
                  href: "https://docs.numerique.gouv.fr/docs/4c19480c-746e-49d9-aa1c-8b94f8790720/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                }}
                start={<Badge>AIDE</Badge>}
              />
            </div>
          )}
        </div>
      </div>
    </Block>
  )
}

export default HomeBanner
