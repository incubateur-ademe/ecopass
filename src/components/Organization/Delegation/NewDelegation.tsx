import { Notice } from "@codegouvfr/react-dsfr/Notice"
import styles from "./NewDelegation.module.css"
import SiretDelegation from "./SiretDelegation"
import UniqueIdDelegation from "./UniqueIdDelegation"

export const NewDelegation = () => {
  return (
    <>
      <h2 className='fr-mt-2w'>Déléguer mes droits à une entreprise</h2>
      <Notice
        className='fr-mb-2w'
        title="Besoin d’aide pour gérer la délégation à un tiers de confiance/bureau d'étude ?"
        link={{
          linkProps: {
            href: "https://docs.numerique.gouv.fr/docs/f223997d-ebee-4ab0-9407-85320a68c36b/",
            target: "_blank",
            rel: "noopener noreferrer",
          },
          text: "Consulter le tutoriel",
        }}
      />
      <div className={styles.cards}>
        <div className={styles.card}>
          <SiretDelegation />
        </div>
        <div className={styles.card}>
          <UniqueIdDelegation />
        </div>
      </div>
    </>
  )
}

export default NewDelegation
