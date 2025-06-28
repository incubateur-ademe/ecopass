"use client"
import { useCallback, useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { exportProducts } from "../../serverFunctions/export"
import Alert from "@codegouvfr/react-dsfr/Alert"
import { useRouter } from "next/navigation"

const NewExport = ({ brand }: { brand?: string }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const onClick = useCallback(() => {
    setIsLoading(true)
    setSuccess(false)
    exportProducts(brand).then(() => {
      setIsLoading(false)
      setSuccess(true)
      router.refresh()
    })
  }, [brand])

  return success ? (
    <Alert
      severity='success'
      title='Zip en cours de création'
      description='Lorsque ce dernier sera prêt, vous pourrez le télécharger dans le tableau ci dessous.'
    />
  ) : (
    <LoadingButton loading={isLoading} onClick={onClick}>
      Télécharger l'affichage environnemental de mes produits
    </LoadingButton>
  )
}

export default NewExport
