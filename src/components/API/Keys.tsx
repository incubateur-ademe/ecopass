"use client"
import { APIKey } from "../../../prisma/src/prisma"
import Table from "../Table/Table"
import { formatDateTime } from "../../services/format"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import { useState } from "react"
import { deleteAPIKey, generateAPIKey } from "../../serverFunctions/user"
import Alert from "@codegouvfr/react-dsfr/Alert"
import styles from "./Keys.module.css"
import { useRouter } from "next/navigation"
import LoadingButton from "../Button/LoadingButton"

const Keys = ({ keys }: { keys: APIKey[] }) => {
  const router = useRouter()
  const [newKey, setNewKey] = useState("")
  const [generatedKey, setGeneratedKey] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const generateKey = () => {
    if (!newKey) {
      return
    }
    setLoading(true)
    generateAPIKey(newKey).then((key) => {
      setLoading(false)
      setGeneratedKey(key)
    })
  }

  return (
    <>
      <h2>Authentification</h2>
      <h3>Ajouter une nouvelle clé</h3>
      {generatedKey ? (
        <Alert
          severity='success'
          title='Nouvelle clé générée'
          description={
            <>
              <p>Veuillez enregistrer cette clé. Elle n'apparaitra qu'une seule fois.</p>
              <div className={styles.key}>
                <span data-testid='new-api-key'>{generatedKey}</span>
                <Button
                  className='fr-ml-2w'
                  size='small'
                  priority='secondary'
                  title='Copier la clé'
                  onClick={() => {
                    navigator.clipboard.writeText(generatedKey)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1000)
                  }}
                  disabled={copied}>
                  {copied ? "Copié" : "Copier"}
                </Button>
              </div>
            </>
          }
        />
      ) : (
        <div className='fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row--middle'>
          <Input
            className='fr-col-12 fr-col-sm-9 fr-mb-0'
            label='Nom de la clé API'
            hideLabel
            nativeInputProps={{
              value: newKey,
              placeholder: "Nom de la clé",
              onChange: (event) => setNewKey(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter" && newKey) {
                  event.preventDefault()
                  generateKey()
                }
              },
            }}
          />
          <div className='fr-col-12 fr-col-sm-3 fr-mt-1w'>
            <LoadingButton loading={loading} disabled={!newKey} onClick={generateKey}>
              Générer une nouvelle clé d'API
            </LoadingButton>
          </div>
        </div>
      )}
      <h3 className='fr-mt-4w'>Mes clés</h3>
      {keys.length > 0 ? (
        <div data-testid='api-keys-table'>
          <Table
            fixed
            caption='Mes clés'
            noCaption
            headers={["Nom", "Dernière utilisation", "Clé", ""]}
            data={keys.map((key) => [
              key.name,
              key.lastUsed ? formatDateTime(key.lastUsed) : "",
              `${key.key}*********`,
              <Button
                size='small'
                priority='secondary'
                iconId='fr-icon-delete-bin-fill'
                key={key.id}
                onClick={() => deleteAPIKey(key.id).then(() => router.refresh())}>
                Supprimer
              </Button>,
            ])}
          />
        </div>
      ) : (
        <Alert severity='info' small description="Vous n'avez généré aucune clé pour le moment." />
      )}
    </>
  )
}

export default Keys
