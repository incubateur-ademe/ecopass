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
  return success ? (
    <Alert
      className='fr-mt-4w'
      title='Fichier correctement téléchargé'
      severity='success'
      description={
        <>
          Nous analysons votre fichier pour vérifier qu’il contient l’ensemble des informations reglementaires, au bon
          format. Cette étape peut prendre quelques minutes.{" "}
          <b>Vous revevrez un mail de conformation suite à cette analyse</b>. Vous pouvez fermer cet onglet.
        </>
      }
    />
  ) : (
    <>
      <p className='fr-mb-4w'>
        Si vous avez besoin d'aide, vous pouvez télécharger{" "}
        <Link href='/exemple/exemple.csv' className='fr-link'>
          un exemple
        </Link>
        , consulter{" "}
        <Link href='/documentation' className='fr-link'>
          la documentation
        </Link>{" "}
        ou contacter notre support à cette adresse{" "}
        <Link className='fr-link' href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}>
          {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
        </Link>
      </p>
      <UploadDSFR
        label='Déposez votre fichier pour déclarer vos produits.'
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
    </>
  )
}

export default Upload
