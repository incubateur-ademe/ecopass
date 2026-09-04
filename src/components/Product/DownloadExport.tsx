"use client"
import { Dispatch, SetStateAction, useCallback, useState } from "react"
import LoadingButton from "../Button/LoadingButton"

const DownloadExport = ({
  name,
  setError,
  index,
}: {
  name: string
  setError: Dispatch<SetStateAction<boolean>>
  index?: number
}) => {
  const [loading, setLoading] = useState(false)
  const download = useCallback(async () => {
    setLoading(true)
    setError(false)

    const file = await fetch(`/exports/${name}${index !== undefined ? `?index=${index}` : ""}`)
    if (!file.ok) {
      setError(true)
    } else {
      const blob = await file.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = index ? `${name}-${index + 1}.zip` : `${name}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    setLoading(false)
  }, [name, setError, index])

  return (
    <LoadingButton onClick={download} loading={loading}>
      Télécharger
    </LoadingButton>
  )
}

export default DownloadExport
