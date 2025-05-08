"use client"

import { Upload as UploadDSFR } from "@codegouvfr/react-dsfr/Upload"
import { useCallback, useState } from "react"
import { uploadCSV } from "../../serverFunctions/uploadCSV"
import { useRouter } from "next/navigation"
import LoadingButton from "../Button/LoadingButton"
import styles from "./Upload.module.css"
import Link from "next/link"

const Upload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const router = useRouter()
  const upload = useCallback(() => {
    if (file) {
      setUploading(true)
      uploadCSV(file).then(() => {
        setUploading(false)
        router.refresh()
      })
    }
  }, [file])

  return (
    <>
      <p>
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
        hint='Format CSV uniquement, 5mb max'
        nativeInputProps={{
          accept: ".csv",
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
