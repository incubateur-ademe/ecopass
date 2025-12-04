import Button from "@codegouvfr/react-dsfr/Button"
import styles from "./SearchActions.module.css"

const SearchActions = ({ onSearch, onReset }: { onSearch: () => void; onReset: () => void }) => {
  return (
    <div className={styles.buttons}>
      <Button onClick={onSearch} iconId='ri-search-line'>
        Rechercher
      </Button>
      <Button onClick={onReset} priority='secondary' iconId='ri-refresh-line'>
        Réinitialiser
      </Button>
    </div>
  )
}

export default SearchActions
