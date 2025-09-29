"use client"

import { exportUpload } from "../../serverFunctions/export"
import { useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { downloadFile } from "../../services/download"

const Download = ({ uploadId, disabled }: { uploadId: string; disabled?: boolean }) => {
  const [download, setDownload] = useState(false)

  const getFilename = (format: "csv" | "xlsx") => {
    return `upload-${uploadId}.${format}`
  }

  return (
    <LoadingButton
      loading={download}
      disabled={disabled}
      onClick={() => {
        setDownload(true)
        exportUpload(uploadId)
          .then((data) => {
            if (typeof data === "string") {
              downloadFile(data, getFilename("csv"))
            } else {
              downloadFile(data, getFilename("xlsx"))
            }
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
