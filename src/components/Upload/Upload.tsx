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

  const router = useRouter()
  const upload = useCallback(() => {
    setError("")
    setSuccess(false)
    setUploading(true)
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
  }, [file])

  const sizeError = file ? file.size > 1 * 1024 * 1024 : false
  return (
    <>
      <p>
        Vous pouvez télécharger{" "}
        <Link href='/exemple/exemple.csv' className='fr-link' prefetch={false}>
          un exemple
        </Link>{" "}
        ou consulter{" "}
        <Link href='/documentation' className='fr-link' prefetch={false}>
          la documentation
        </Link>
      </p>
      <p className='fr-mb-4w'>
        Si vous avez besoin d'aide, veuillez contacter notre support à l'adresse suivante :{" "}
        <Link
          className='fr-link'
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}
          prefetch={false}
          target='_blank'
          rel='noopener noreferrer'>
          {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
        </Link>
      </p>
      {success || error ? (
        <Alert
          data-testid={`upload-${success ? "success" : "error"}`}
          className='fr-mt-4w'
          title={success ? "Fichier correctement téléchargé" : "Erreur lors de l'analyse du fichier"}
          severity={success ? "success" : "error"}
          description={
            success ? (
              <>
                Nous analysons votre fichier pour vérifier qu’il contient l’ensemble des informations réglementaires, au
                bon format. Cette étape peut prendre quelques minutes.{" "}
                <b>Vous recevrez un mail de confirmation suite à cette analyse</b>. Vous pouvez fermer cet onglet.
              </>
            ) : (
              <>
                Une erreur inconnue est survenue lors de l'analyse du fichier. Si l'erreur persiste n'hesitez pas à nous
                envoyer votre fichier par mail, à l'adresse suivante, pour analyse plus approfondie.
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
      ) : (
        <>
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
            Envoyer mon fichier pour validation
          </LoadingButton>
        </>
      )}
    </>
  )
}

export default Upload
