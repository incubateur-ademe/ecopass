"use client"

import { exportUpload } from "../../serverFunctions/export"
import { useState } from "react"
import LoadingButton from "../Button/LoadingButton"

const Download = ({ uploadId, disabled }: { uploadId: string; disabled?: boolean }) => {
  const [download, setDownload] = useState(false)
  return (
    <LoadingButton
      loading={download}
      disabled={disabled}
      onClick={() => {
        setDownload(true)
        exportUpload(uploadId).then((csv) => {
          const blob = new Blob([csv], { type: "text/csv" })

          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `upload-${uploadId}.csv`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          setDownload(false)
        })
      }}>
      Télécharger
    </LoadingButton>
  )
}

export default Download
