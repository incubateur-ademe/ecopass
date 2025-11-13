import { Footer as FooterDSFR } from "@codegouvfr/react-dsfr/Footer"
import Link from "next/link"
import { isTestEnvironment } from "../../utils/test"

const Footer = () => {
  return (
    <FooterDSFR
      brandTop={
        <>
          République
          <br />
          Française
        </>
      }
      homeLinkProps={{
        href: "/",
        title: "Accueil - Affichage environnemental",
      }}
      accessibility='non compliant'
      contentDescription={
        isTestEnvironment() ? null : (
          <>
            Le portail de l’affichage environnemental est un service développé par le Commissariat général au
            développement durable, au sein du Ministère de la Transition Écologique. L’équipe suit une démarche
            d’amélioration continue pour optimiser le service proposé. Vous pouvez contacter l’équipe par mail à
            l’adresse{" "}
            <Link
              href='mailto:affichage-environnemental@ecobalyse.beta.gouv.fr'
              target='_blank'
              rel='noopener noreferrer'>
              affichage-environnemental@ecobalyse.beta.gouv.fr
            </Link>
            .
          </>
        )
      }
      termsLinkProps={{
        href: "/mentions-legales",
        prefetch: false,
      }}
      websiteMapLinkProps={{
        href: "/plan-du-site",
        prefetch: false,
      }}
      bottomItems={[
        <Link key='politique' className='fr-footer__bottom-link' href='/politique-de-confidentialite'>
          Politique de confidentialité
        </Link>,
        <Link key='stats' className='fr-footer__bottom-link' href='/stats'>
          Statistiques
        </Link>,
      ]}
      domains={["ecologie.gouv.fr", "ecobalyse.beta.gouv.fr", "beta.gouv.fr", "ademe.fr"]}
    />
  )
}

export default Footer
