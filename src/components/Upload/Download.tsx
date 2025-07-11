"use client"

import { exportUpload } from "../../serverFunctions/export"
import { useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { downloadCSV } from "../../services/download"

const Download = ({ uploadId, disabled }: { uploadId: string; disabled?: boolean }) => {
  const [download, setDownload] = useState(false)
  return (
    <LoadingButton
      loading={download}
      disabled={disabled}
      onClick={() => {
        setDownload(true)
        exportUpload(uploadId)
          .then((csv) => {
            downloadCSV(csv, `upload-${uploadId}.csv`)
          })
          .finally(() => {
            setDownload(false)
          })
      }}>
      Télécharger
    </LoadingButton>
  )
}

export default Download
