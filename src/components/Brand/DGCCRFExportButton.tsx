"use client"
import React, { useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { exportDgccrfBrandProducts } from "../../serverFunctions/dgccrf"
import { downloadFile } from "../../services/download"
import tableStyles from "./BrandProductsTable.module.css"
import Alert from "@codegouvfr/react-dsfr/Alert"

const DGCCRFExport = ({
  productCount,
  brandId,
  filter,
}: {
  productCount: number
  brandId: string
  filter: { category?: string; organization?: string }
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const downloadCSV = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setLoading(true)
    setError("")

    try {
      const result = await exportDgccrfBrandProducts(brandId, filter.category, filter.organization)
      if (typeof result === "object") {
        setError(result.error || "Une erreur est survenue lors de l'export")
        return
      }

      const filename = `${brandId}-${new Date().toISOString()}.csv`
      downloadFile(result, filename)
    } catch {
      setError("Une erreur est survenue lors de l'export")
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <div className={tableStyles.tableHeader}>
        <h3>
          {productCount} référence{productCount > 1 ? "s" : ""} produit
        </h3>
        <LoadingButton loading={loading} onClick={downloadCSV}>
          Télécharger le CSV
        </LoadingButton>
      </div>
      {error && <Alert severity='error' title={error} />}
    </>
  )
}

export default DGCCRFExport
