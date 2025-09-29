"use client"

import { useCallback, useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { exportScores } from "../../serverFunctions/export"
import { downloadFile } from "../../services/download"

const DownloadScores = ({ brand }: { brand?: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const downloadScores = useCallback(() => {
    setIsLoading(true)
    exportScores(brand)
      .then((csv) => {
        downloadFile(csv, brand ? `${brand}-scores.csv` : "scores.csv")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [brand])

  return (
    <LoadingButton className='fr-mb-2w' loading={isLoading} onClick={downloadScores}>
      Télécharger les scores
    </LoadingButton>
  )
}

export default DownloadScores
