"use client"

import { Upload as UploadDSFR } from "@codegouvfr/react-dsfr/Upload"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingButton from "../Button/LoadingButton"
import styles from "./Upload.module.css"
import Link from "next/link"
import { uploadFile } from "../../serverFunctions/upload"
import Alert from "@codegouvfr/react-dsfr/Alert"

const Upload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  const router = useRouter()
  const upload = useCallback(() => {
    if (file) {
      setSuccess(false)
      setUploading(true)
      uploadFile(file).then(() => {
        setUploading(false)
        setSuccess(true)
        setFile(null)
        router.refresh()
      })
    }
  }, [file])
  return (
    <>
      <p className='fr-mb-4w'>
        Si vous avez besoin d'aide, vous pouvez télécharger{" "}
        <Link href='/exemple/exemple.csv' className='fr-link'>
          un exemple
        </Link>
        , ou consulter{" "}
        <Link href='/documentation' className='fr-link'>
          la documentation
        </Link>
      </p>
      <UploadDSFR
        disabled={uploading}
        hint='Format CSV ou JSON uniquement, 5mb max'
        nativeInputProps={{
          accept: ".csv,.json",
          onChange: (event) => setFile(event.target.files?.[0] || null),
        }}
      />
      <LoadingButton disabled={!file} onClick={upload} loading={uploading} className={styles.button}>
        Uploader mon fichier
      </LoadingButton>
      {success && (
        <Alert
          className='fr-mt-4w'
          title='Fichier correctement téléchargé'
          severity='success'
          description="L'analyse de vos produits peut prendre un peu de temps, vous pouvez suivre la progression dans le tableau 'Mes fichiers' et nous vous enverrons un mail lorsqu'il sera completement analysé."
        />
      )}
    </>
  )
}

export default Upload
