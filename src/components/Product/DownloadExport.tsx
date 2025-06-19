"use client"
import { Dispatch, SetStateAction, useCallback, useState } from "react"
import LoadingButton from "../Button/LoadingButton"

const DownloadExport = ({ name, setError }: { name: string; setError: Dispatch<SetStateAction<boolean>> }) => {
  const [loading, setLoading] = useState(false)
  const download = useCallback(async () => {
    setLoading(true)
    setError(false)

    const file = await fetch(`/exports/${name}`)
    if (!file.ok) {
      setError(true)
    } else {
      const blob = await file.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${name}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    setLoading(false)
  }, [name])

  return (
    <LoadingButton onClick={download} loading={loading}>
      Télécharger
    </LoadingButton>
  )
}

export default DownloadExport
