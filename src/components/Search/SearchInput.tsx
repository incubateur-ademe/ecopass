"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import BarcodeScanner from "./BarcodeScanner"
import styles from "./SearchInput.module.css"
import { useState } from "react"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { exportOrganizationsData } from "../../serverFunctions/dgccrf"
import { downloadFile } from "../../services/download"
import LoadingButton from "../Button/LoadingButton"

const SearchInput = ({
  label,
  placeholder,
  value,
  onChange,
  onSearch,
  stateRelatedMessage,
  searchButtonHref,
  advancedSearchHref,
  canDownload,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSearch?: (value?: string) => void
  buttonLabel?: string
  stateRelatedMessage?: string
  searchButtonHref?: string
  advancedSearchHref?: string
  advancedSearchLabel?: string
  canDownload?: boolean
}) => {
  const [error, setError] = useState("")
  const [downloadLoading, setDownloadLoading] = useState(false)

  const handleSearch = () => {
    if (onSearch) {
      onSearch()
    }
  }

  const handleDownloadCSV = async () => {
    setDownloadLoading(true)
    try {
      const csv = await exportOrganizationsData()
      if (typeof csv === "string") {
        downloadFile(csv, "organisations_produits.csv")
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
    } finally {
      setDownloadLoading(false)
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
        {onSearch && <BarcodeScanner onScan={onSearch} setError={setError} />}
      </div>

      {error && <Alert severity='error' small description={error} className='fr-mt-2w' />}
      <ul className={styles.buttons}>
        <li>
          {searchButtonHref ? (
            <Button linkProps={{ href: searchButtonHref, prefetch: false }} iconId='ri-search-line'>
              Rechercher
            </Button>
          ) : (
            <Button iconId='fr-icon-search-line' onClick={handleSearch}>
              Rechercher
            </Button>
          )}
        </li>
        {advancedSearchHref && (
          <li>
            <Button linkProps={{ href: advancedSearchHref }} priority='secondary' iconId='ri-settings-line'>
              Recherche avancée
            </Button>
          </li>
        )}
        {canDownload && (
          <li>
            <LoadingButton
              loading={downloadLoading}
              iconId='ri-download-line'
              onClick={handleDownloadCSV}
              priority='secondary'>
              Télécharger les données (CSV)
            </LoadingButton>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SearchInput
