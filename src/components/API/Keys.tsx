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

const Keys = ({ keys }: { keys: APIKey[] }) => {
  const router = useRouter()
  const [newKey, setNewKey] = useState("")
  const [generatedKey, setGeneratedKey] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const generateKey = () => {
    if (!newKey) {
      return
    }
    generateAPIKey(newKey).then((key) => setGeneratedKey(key))
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
                <span>{generatedKey}</span>
                <Button
                  className='fr-ml-2w'
                  size='small'
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
            label='Code GTIN'
            hideLabel
            nativeInputProps={{
              value: newKey,
              placeholder: "Nom de la clé",
              onChange: (event) => setNewKey(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  generateKey()
                }
              },
            }}
          />
          <div className='fr-col-12 fr-col-sm-3 fr-mt-1w'>
            <Button disabled={!newKey} onClick={generateKey}>
              Générer une nouvelle clé d'API
            </Button>
          </div>
        </div>
      )}
      <h3 className='fr-mt-4w'>Mes clés</h3>
      {keys.length > 0 ? (
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
              iconId='fr-icon-delete-bin-fill'
              key={key.id}
              onClick={() => deleteAPIKey(key.id).then(() => router.refresh())}>
              Supprimer
            </Button>,
          ])}
        />
      ) : (
        <p>Vous n'avez généré aucune clé pour le moment.</p>
      )}
    </>
  )
}

export default Keys
