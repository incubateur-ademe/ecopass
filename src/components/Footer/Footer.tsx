import { Footer as FooterDSFR } from "@codegouvfr/react-dsfr/Footer"

const Footer = () => {
  return (
    <FooterDSFR
      brandTop='République Française'
      homeLinkProps={{
        href: "/",
        title: "Accueil - Affichage environnemental",
      }}
      accessibility='non compliant'
      contentDescription='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
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
