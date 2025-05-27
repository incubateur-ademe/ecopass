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
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [longTime, setLongTime] = useState(false)

  const router = useRouter()
  const upload = useCallback(() => {
    setLongTime(false)
    setError("")
    setSuccess(false)
    setUploading(true)
    if (file) {
      setTimeout(() => {
        setLongTime(true)
      }, 10000)
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
  }, [file])

  const sizeError = file ? file.size > 1 * 1024 * 1024 : false

  return success || error ? (
    <Alert
      className='fr-mt-4w'
      title={success ? "Fichier correctement téléchargé" : "Erreur lors de l'analyse du fichier"}
      severity={success ? "success" : "error"}
      description={
        success ? (
          <>
            Nous analysons votre fichier pour vérifier qu’il contient l’ensemble des informations reglementaires, au bon
            format. Cette étape peut prendre quelques minutes.{" "}
            <b>Vous revevrez un mail de conformation suite à cette analyse</b>. Vous pouvez fermer cet onglet.
          </>
        ) : (
          <>
            Une erreur inconnue est survenue lors de l'analyse du fichier. Si l'erreur persiste n'hesitez pas à nous
            envoyer votre fichier par mail, à l'adresse suivante, pour analyse plus approfondie.
            <br />
            <Link className='fr-link' href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}>
              {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
            </Link>
          </>
        )
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
        hint='Format CSV uniquement, 1mb max'
        state={sizeError ? "error" : "default"}
        stateRelatedMessage={sizeError ? "Le fichier doit faire moins de 1mb" : ""}
        nativeInputProps={{
          accept: ".csv",
          onChange: (event) => setFile(event.target.files?.[0] || null),
        }}
      />
      <LoadingButton disabled={!file || sizeError} onClick={upload} loading={uploading} className={styles.button}>
        Uploader mon fichier
      </LoadingButton>
      {uploading && longTime && (
        <p>Le temps de chargement peut être long si le fichier est volumineux. Veuillez ne pas quitter la page.</p>
      )}
    </>
  )
}

export default Upload
