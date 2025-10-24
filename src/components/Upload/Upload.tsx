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
    <div className={success || error ? "" : styles.container}>
      <Alert
        className={success || error ? "" : styles.help}
        title='Aide'
        severity='info'
        description={
          <>
            <span>Vous souhaitez un modèle ?</span>
            <br />
            <span>
              <span className='fr-icon-arrow-right-s-fill' aria-hidden='true' />{" "}
              <Link href='/exemple/exemple.xlsx' className='fr-link' prefetch={false}>
                Téléchargez notre template Excel
              </Link>
            </span>
            <br />
            <span>
              <span className='fr-icon-arrow-right-s-fill' aria-hidden='true' />{" "}
              <Link href='/exemple/exemple.csv' className='fr-link' prefetch={false}>
                Téléchargez notre template CSV
              </Link>
            </span>
            <br />
            <br />
            <span>
              Comment concevoir un fichier de déclaration pour le portail ?{" "}
              <Link href='/documentation' className='fr-link' prefetch={false}>
                Consultez l'aide en ligne
              </Link>
              .
            </span>
            <br />
            <br />
            <span>
              Si vous voulez faire un test avant de vous lancer, rejoignez{" "}
              <Link
                href='https://test-affichage-environnemental.ecobalyse.beta.gouv.fr/'
                className='fr-link'
                target='_blank'
                rel='noopener noreferrer'>
                le serveur de test
              </Link>
              .
            </span>
            <br />
            <br />
            <span>
              Si vous avez besoin d’aide,{" "}
              <Link
                className='fr-link'
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}
                prefetch={false}
                target='_blank'
                rel='noopener noreferrer'>
                vous pouvez contacter le service support.
              </Link>
            </span>
          </>
        }
      />
      {success || error ? (
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
                Le système va maintenant l’analyser pour vérifier qu’il contient l’ensemble des informations
                réglementaires au bon format. Cette étape peut prendre quelques minutes en fonction de la taille de
                votre CSV. <b>Une fois l’analyse terminée, vous recevrez un mail vous indiquant le résultat</b>. Vous
                pouvez fermer cet onglet.
              </>
            ) : (
              <>
                {error}. Si l'erreur persiste n'hesitez pas à nous envoyer votre fichier par mail, à l'adresse suivante,
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
      ) : (
        <div className={styles.upload}>
          <UploadDSFR
            label='Déposez votre fichier pour déclarer vos produits.'
            disabled={uploading}
            hint='Format CSV ou XLSX, 1mb max'
            state={sizeError ? "error" : "default"}
            stateRelatedMessage={sizeError ? "Le fichier doit faire moins de 1mb" : ""}
            nativeInputProps={{
              accept: ".csv, .xlsx",
              onChange: (event) => setFile(event.target.files?.[0] || null),
            }}
          />
          <LoadingButton disabled={!file || sizeError} onClick={upload} loading={uploading} className={styles.button}>
            Envoyer mon fichier pour validation
          </LoadingButton>
        </div>
      )}
    </div>
  )
}

export default Upload
