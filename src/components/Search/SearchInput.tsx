"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import BarcodeScanner from "./BarcodeScanner"
import styles from "./SearchInput.module.css"
import { useState } from "react"
import { Alert } from "@codegouvfr/react-dsfr/Alert"

const SearchInput = ({
  label,
  placeholder,
  value,
  onChange,
  onSearch,
  stateRelatedMessage,
  searchButtonHref,
  advancedSearchHref,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch?: () => void
  buttonLabel?: string
  stateRelatedMessage?: string
  searchButtonHref?: string
  advancedSearchHref?: string
  advancedSearchLabel?: string
}) => {
  const [error, setError] = useState("")

  const handleSearch = () => {
    if (onSearch) {
      onSearch()
    }
  }

  return (
    <div className={styles.box}>
      <div className={styles.content}>
        <div className={styles.input}>
          <Input
            label={label}
            stateRelatedMessage={stateRelatedMessage}
            state={stateRelatedMessage ? "info" : undefined}
            nativeInputProps={{
              value,
              onChange: (event) => onChange(event.target.value),
              placeholder,
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleSearch()
                }
              },
            }}
          />
        </div>
        <BarcodeScanner
          onScan={(code) => {
            onChange(code)
          }}
          setError={setError}
        />
      </div>

      {error && <Alert severity='error' small description={error} className='fr-mt-2w' />}
      {(searchButtonHref || advancedSearchHref) && (
        <ul className={styles.buttons}>
          {searchButtonHref && (
            <li>
              <Button linkProps={{ href: searchButtonHref, prefetch: false }} iconId='ri-search-line'>
                Rechercher
              </Button>
            </li>
          )}
          {advancedSearchHref && (
            <li>
              <Button linkProps={{ href: advancedSearchHref }} priority='secondary' iconId='ri-settings-line'>
                Recherche avancée
              </Button>
            </li>
          )}
        </ul>
      )}
      {!searchButtonHref && !advancedSearchHref && (
        <Button iconId='fr-icon-search-line' onClick={handleSearch} className={styles.searchButton}>
          Rechercher
        </Button>
      )}
    </div>
  )
}

export default SearchInput
