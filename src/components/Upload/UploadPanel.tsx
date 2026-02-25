"use client"

import { Upload as UploadDSFR } from "@codegouvfr/react-dsfr/Upload"
import Alert from "@codegouvfr/react-dsfr/Alert"
import Link from "next/link"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingButton from "../Button/LoadingButton"
import styles from "./UploadPanel.module.css"
import { uploadFile } from "../../serverFunctions/upload"

const UploadPanel = () => {
  const [file, setFile] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)

  const router = useRouter()
  const upload = useCallback(() => {
    setError("")
    setSuccess(false)
    setUploading(true)
    try {
      if (file) {
        uploadFile(file).then((error) => {
          setUploading(false)
          setFile(null)
          if (error) {
            setError(error)
          } else {
            setSuccess(true)
          }
          router.refresh()
        })
      }
    } finally {
      setUploading(false)
    }
  }, [file, router])

  const sizeError = file ? file.size > 1 * 1024 * 1024 : false
  if (success || error) {
    return (
      <Alert
        data-testid={`upload-${success ? "success" : "error"}`}
        className='fr-mt-4w'
        title={
          success
            ? "Votre fichier a été correctement téléchargé"
            : "Une erreur est survenue lors de l'analyse du fichier"
        }
        severity={success ? "success" : "error"}
        description={
          success ? (
            <>
              Le système va maintenant l'analyser pour vérifier qu'il contient l'ensemble des informations
              réglementaires au bon format. Cette étape peut prendre quelques minutes en fonction de la taille de votre
              fichier. <b>Une fois l'analyse terminée, vous recevrez un mail vous indiquant le résultat</b>. Vous pouvez
              fermer cet onglet.
            </>
          ) : (
            <>
              {error}. Si l'erreur persiste n'hésitez pas à nous envoyer votre fichier par mail, à l'adresse suivante,
              pour analyse plus approfondie.
              <br />
              <Link
                className='fr-link'
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}
                prefetch={false}
                target='_blank'
                rel='noopener noreferrer'>
                {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
              </Link>
            </>
          )
        }
      />
    )
  }

  return (
    <>
      <div className={styles.uploadCard}>
        <UploadDSFR
          label='Déposez votre fichier pour déclarer vos produits'
          disabled={uploading}
          hint='Format CSV ou XLSX, 1mb max'
          state={sizeError ? "error" : "default"}
          stateRelatedMessage={sizeError ? "Le fichier doit faire moins de 1mb" : ""}
          nativeInputProps={{
            accept: ".csv, .xlsx",
            onChange: (event) => setFile(event.target.files?.[0] || null),
          }}
        />
      </div>
      <LoadingButton disabled={!file || sizeError} onClick={upload} loading={uploading} className={styles.button}>
        Envoyer mon fichier pour validation
      </LoadingButton>
    </>
  )
}

export default UploadPanel
