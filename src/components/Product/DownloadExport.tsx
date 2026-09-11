"use client"
import { Dispatch, SetStateAction, useCallback, useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { ExportType } from "@prisma/enums"

const DownloadExport = ({
  name,
  setError,
  index,
  exportType,
}: {
  name: string
  setError: Dispatch<SetStateAction<boolean>>
  index?: number
  exportType: ExportType
}) => {
  const [loading, setLoading] = useState(false)
  const download = useCallback(async () => {
    setLoading(true)
    setError(false)

    const params = new URLSearchParams()
    const fileType = exportType === ExportType.SVG ? "zip" : "csv"
    params.append("exportType", fileType)
    if (index !== undefined) {
      params.append("index", String(index))
    }
    const file = await fetch(`/exports/${name}?${params.toString()}`)
    if (!file.ok) {
      setError(true)
    } else {
      const blob = await file.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = index ? `${name}-${index + 1}.${fileType}` : `${name}.${fileType}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    setLoading(false)
  }, [name, setError, index, exportType])

  return (
    <LoadingButton onClick={download} loading={loading}>
      Télécharger
    </LoadingButton>
  )
}

export default DownloadExport
