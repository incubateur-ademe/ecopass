import styles from "./NewDelegation.module.css"
import SiretDelegation from "./SiretDelegation"
import UniqueIdDelegation from "./UniqueIdDelegation"

export const NewDelegation = () => {
  return (
    <>
      <h2 className='fr-mt-2w'>Déléguer mes droits à une entreprise</h2>
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
