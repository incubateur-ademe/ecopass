"use client"
import { useCallback, useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { exportProducts } from "../../serverFunctions/export"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { useRouter } from "next/navigation"
import { ExportType } from "@prisma/enums"

const NewExport = ({ brand, type }: { brand?: string; type: ExportType }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const onClick = useCallback(() => {
    setIsLoading(true)
    setSuccess(false)
    exportProducts(brand, type).then(() => {
      setIsLoading(false)
      setSuccess(true)
      router.refresh()
    })
  }, [router, brand, type])

  return success ? (
    <Alert
      severity='success'
      title='Fichier en cours de création'
      description='Lorsque ce dernier sera prêt, vous pourrez le télécharger dans le tableau ci dessous.'
    />
  ) : (
    <LoadingButton loading={isLoading} onClick={onClick}>
      Télécharger
    </LoadingButton>
  )
}

export default NewExport
