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
import { OrganizationType, UserType } from "@prisma/client"
import { Badge } from "@codegouvfr/react-dsfr/Badge"

const HomeBanner = ({
  connected,
  isPro,
  userType,
  organizationType,
}: {
  connected?: boolean
  isPro?: boolean
  userType?: UserType
  organizationType?: OrganizationType | null
}) => {
  const isOtherOrganization =
    organizationType === OrganizationType.Other || organizationType === OrganizationType.Distributor
  return (
    <Block
      large
      type='yellow'
      className={isPro || connected ? "" : styles.background}
      containerClassName={isPro && !connected ? styles.proBackground : ""}>
      <div
        className={classNames(styles.banner, {
          [styles.bannerTest]: isTestEnvironment(),
          [styles.bannerPro]: isPro && !connected,
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
          !isPro &&
          !connected && <Image className={styles.image} src='/images/etiquette.svg' alt='' width={378} height={188} />
        )}
        <div>
          <h1>
            {isTestEnvironment()
              ? "Serveur de test pour la déclaration du coût environnemental de produits textiles"
              : isPro
                ? "Déclarer le coût environnemental de vos produits textiles"
                : "Affichage environnemental"}
          </h1>
          {!isTestEnvironment() &&
            (isPro ? (
              !connected && (
                <>
                  <p className={styles.description}>
                    Vous êtes un professionnel, connectez-vous avec ProConnect ou faites une demande de création de
                    compte pour déclarer le coût environnemental de produits
                  </p>
                  <Alert
                    small
                    className='fr-mb-4w'
                    severity='info'
                    description={
                      <>
                        Vous n’avez pas de SIRET ou/et pas de compte France connect,{" "}
                        <Link
                          className='fr-link'
                          target='_blank'
                          rel='noopener noreferrer'
                          href='https://demarche.numerique.gouv.fr/commencer/registration-of-companies-without-a-siret-number-o'>
                          remplissez ce formulaire
                        </Link>{" "}
                        pour fournir les pièces nécessaires à la création de votre espace.
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
                  Une mesure d'impact portée par le gouvernement, simple et comparable pour comprendre l'impact
                  environnemental de vos vêtements.
                </p>
                <div className={styles.brands}>
                  <LastBrands />
                </div>
              </>
            ))}
          {connected &&
            (userType === UserType.PROFESSIONNEL ? (
              <div className={styles.tiles}>
                <Tile
                  orientation='horizontal'
                  title='Gérez votre entreprise'
                  imageUrl='/images/catalog.svg'
                  imageAlt=''
                  titleAs='h2'
                  desc={
                    isOtherOrganization
                      ? "Listez les marques que vous souhaitez suivre"
                      : "Gérez les informations de votre entreprise"
                  }
                  linkProps={{ href: "/organisation" }}
                  start={<Badge>ORGANISATION</Badge>}
                />
                <Tile
                  orientation='horizontal'
                  title='Déclarez vos produits'
                  imageUrl='/images/contract.svg'
                  imageAlt=''
                  titleAs='h2'
                  desc={
                    isOtherOrganization
                      ? "Déclarez des produits pour des marques non engagées dans l’affichage"
                      : "Déclarez officiellement vos produits et suivez leur statut"
                  }
                  linkProps={{ href: "/declarations" }}
                  start={<Badge>DÉPÔT OFFICIEL</Badge>}
                />
                <Tile
                  orientation='horizontal'
                  title='Consultez vos produits'
                  imageUrl='/images/search.svg'
                  imageAlt=''
                  titleAs='h2'
                  desc={
                    isOtherOrganization
                      ? "Retrouvez ici tous les produits que vous avez déclarés"
                      : "Retrouvez ici tous vos produits déclarés"
                  }
                  linkProps={{ href: "/produits" }}
                  start={<Badge>PRODUITS</Badge>}
                />
              </div>
            ) : (
              <>
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
                      href: "https://docs.numerique.gouv.fr/docs/25bec383-0f3a-4fea-8e99-c6f80d86103c/",
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }}
                    start={<Badge>AIDE</Badge>}
                  />
                </div>
                <Alert
                  severity='info'
                  small
                  description='Vous ne pouvez pas encore déclarer de produits des catégories : linge de maison, accessoires, chaussures, produits rembourrés (doudoune, peluche...), lots de vêtements.'
                  className='fr-mt-4w'
                />
              </>
            ))}
        </div>
      </div>
    </Block>
  )
}

export default HomeBanner
