"use client"

import Select from "@codegouvfr/react-dsfr/Select"
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch"
import Button from "@codegouvfr/react-dsfr/Button"
import { organizationTypes } from "../../utils/organization/types"
import { useState } from "react"
import { OrganizationType } from "@prisma/enums"
import { useRouter } from "next/navigation"
import { changeOrganizationSettings } from "../../serverFunctions/admin"
import styles from "./AdminForm.module.css"

const AdminForm = ({ id, type, noGTIN }: { id: string; type: OrganizationType | null; noGTIN: boolean }) => {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<OrganizationType | "">(type || "")
  const [noGtin, setNoGtin] = useState(noGTIN)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await changeOrganizationSettings(id, { type: selectedType || undefined, noGTIN: noGtin })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
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
      {(selectedType === OrganizationType.Brand || selectedType === OrganizationType.BrandAndDistributor) && (
        <ToggleSwitch
          className={styles.toggle}
          label='Organisation sans GTIN'
          checked={noGtin}
          disabled={loading}
          onChange={(checked) => setNoGtin(checked)}
        />
      )}
      <Button
        className='fr-mt-1w'
        type='submit'
        disabled={loading || selectedType === "" || (selectedType === type && noGtin === noGTIN)}>
        Valider
      </Button>
    </form>
  )
}

export default AdminForm
