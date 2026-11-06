"use client"

import Select from "@codegouvfr/react-dsfr/Select"
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch"
import Button from "@codegouvfr/react-dsfr/Button"
import { organizationTypes } from "../../utils/organization/types"
import { useState } from "react"
import { OrganizationType } from "@prisma/enums"
import { useRouter } from "next/navigation"
import { changeOrganizationSettings, changeBrandSettings } from "../../serverFunctions/admin"
import styles from "./AdminForm.module.css"

const AdminForm = ({
  id,
  type,
  noGTIN,
  mode,
}: {
  id: string
  type?: OrganizationType | null
  noGTIN: boolean | null
  mode: "organization" | "brand"
}) => {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<OrganizationType | "">(type || "")
  const [noGtin, setNoGtin] = useState(noGTIN || false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "brand") {
        await changeBrandSettings(id, { noGTIN: noGtin })
      } else {
        await changeOrganizationSettings(id, { type: selectedType || undefined, noGTIN: noGtin })
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  let buttonDisabled = loading
  if (mode === "organization") {
    buttonDisabled = buttonDisabled || selectedType === "" || (selectedType === type && noGtin === noGTIN)
  } else {
    buttonDisabled = buttonDisabled || noGtin === noGTIN
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {mode === "organization" && (
        <Select
          label="Type de l'organisation"
          nativeSelectProps={{
            name: "organizationType",
            disabled: loading,
            value: selectedType,
            onChange: (event) => setSelectedType(event.currentTarget.value as OrganizationType),
          }}>
          <option value='' hidden>
            -- Sélectionner un type --
          </option>
          {Object.entries(organizationTypes).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Select>
      )}
      {(mode === "brand" ||
        selectedType === OrganizationType.Brand ||
        selectedType === OrganizationType.BrandAndDistributor) && (
        <ToggleSwitch
          className={styles.toggle}
          label={mode === "organization" ? "Organisation sans GTIN" : "Marque sans GTIN"}
          checked={noGtin}
          disabled={loading}
          onChange={setNoGtin}
        />
      )}
      <Button className='fr-mt-1w' type='submit' disabled={buttonDisabled}>
        Valider
      </Button>
    </form>
  )
}

export default AdminForm
