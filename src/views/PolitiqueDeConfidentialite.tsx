import Block from "../components/Block/Block"
import { LegalNotice } from "@incubateur-ademe/legal-pages-react/LegalNotice"
import styles from "./PolitiqueDeConfidentialite.module.css"

const PolitiqueDeConfidentialite = () => {
  return (
    <Block className={styles.container}>
      <LegalNotice
        includeBetaGouv
        siteName='Affichage Environnemental'
        siteUrl={process.env.NEXTAUTH_URL!}
        licenceUrl='https://github.com/incubateur-ademe/ecopass/blob/main/LICENSE'
        privacyPolicyUrl='/politique-de-confidentialite'
        siteHost={{
          name: "Scalingo",
          address: "13 rue Jacques Peirotes, 67000 Strasbourg",
          country: "France",
          email: "hello@scalingo.com",
        }}
        contactEmail={process.env.NEXT_PUBLIC_SUPPORT_MAIL!}
      />
    </Block>
  )
}

export default PolitiqueDeConfidentialite
