import { Footer as FooterDSFR } from "@codegouvfr/react-dsfr/Footer"
import Link from "next/link"

const Footer = () => {
  return (
    <FooterDSFR
      brandTop='République Française'
      homeLinkProps={{
        href: "/",
        title: "Accueil - Affichage environnemental",
      }}
      accessibility='non compliant'
      contentDescription={
        <>
          Le portail de déclaration de l’affichage environnemental est un service développé par l’Agence de la
          transition écologique, le Commissariat général au développement durable et le Ministère de la Transition
          Écologique. Ce service est actuellement en beta privé. Vous pouvez contacter l’équipe par mail à l’adresse{" "}
          <Link
            href='mailto:affichage-environnemental@ecobalyse.beta.gouv.fr'
            target='_blank'
            rel='noopener noreferrer'>
            affichage-environnemental@ecobalyse.beta.gouv.fr
          </Link>
          .
        </>
      }
      termsLinkProps={{
        href: "/politique-de-confidentialite",
        prefetch: false,
      }}
      websiteMapLinkProps={{
        href: "/plan-du-site",
        prefetch: false,
      }}
      domains={["ecologie.gouv.fr", "ecobalyse.beta.gouv.fr", "beta.gouv.fr", "ademe.fr"]}
    />
  )
}

export default Footer
