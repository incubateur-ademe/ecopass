"use client"

import Alert from "@codegouvfr/react-dsfr/Alert"
import { Select } from "@codegouvfr/react-dsfr/Select"
import LoadingButton from "../Button/LoadingButton"
import { useMemo, useState } from "react"
import { exportDgccrfBrandProducts } from "../../serverFunctions/dgccrf"
import { downloadFile } from "../../services/download"

const sanitizeFilename = (name: string) => name.replace(/[^a-zA-Z0-9-_]+/g, "-").toLowerCase()

const DgccrfExportForm = ({
  brands,
}: {
  brands: {
    id: string
    name: string
  }[]
}) => {
  const [brandId, setBrandId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedBrand = useMemo(() => brands.find((brand) => brand.id === brandId) || null, [brands, brandId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!brandId) {
      setError("Veuillez selectionner une marque")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await exportDgccrfBrandProducts(brandId)
      if (typeof result === "object") {
        setError(result.error || "Une erreur est survenue lors de l'export")
        return
      }

      const filename = `${sanitizeFilename(selectedBrand?.name || brandId)}-${new Date().toISOString()}.csv`
      downloadFile(result, filename)
    } catch {
      setError("Une erreur est survenue lors de l'export")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert severity='error' title='Export impossible' description={error} />}
      <Select
        label='Marque à exporter'
        hint='Choisissez une marque pour générer un CSV avec tout ses produits.'
        nativeSelectProps={{
          value: brandId,
          onChange: (event) => setBrandId(event.target.value),
        }}>
        <option value=''>Sélectionner une marque</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </Select>
      <div className='fr-mt-2w'>
        <LoadingButton loading={loading} disabled={!brandId} nativeButtonProps={{ type: "submit" }}>
          Télécharger le CSV
        </LoadingButton>
      </div>
    </form>
  )
}

export default DgccrfExportForm
