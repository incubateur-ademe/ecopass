import { Footer as FooterDSFR } from "@codegouvfr/react-dsfr/Footer"

const Footer = () => {
  return (
    <FooterDSFR
      brandTop='Écopass'
      homeLinkProps={{
        href: "/",
        title: "Accueil - Écopass",
      }}
      accessibility='non compliant'
      contentDescription='
Ce message est à remplacer par les informations de votre site.

Comme exemple de contenu, vous pouvez indiquer les informations 
suivantes : Le site officiel d’information administrative pour les entreprises.
Retrouvez toutes les informations et démarches administratives nécessaires à la création, 
à la gestion et au développement de votre entreprise.
'
      termsLinkProps={{
        href: "/politique-de-confidentialite",
      }}
      websiteMapLinkProps={{
        href: "/plan-du-site",
      }}
    />
  )
}

export default Footer
