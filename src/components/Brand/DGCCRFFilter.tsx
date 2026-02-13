"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Select from "@codegouvfr/react-dsfr/Select"
import styles from "./DGCCRFFilter.module.css"
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup"
import { productMapping } from "../../utils/ecobalyse/mappings"
import Input from "@codegouvfr/react-dsfr/Input"

const DGCCRFFilter = ({
  filter,
  organizations,
}: {
  filter: {
    category?: string
    organization?: string
    from?: string
    to?: string
  }
  organizations: {
    key: string
    value: string
  }[]
}) => {
  const [category, setCategory] = useState(filter.category || "")
  const [organization, setOrganization] = useState(filter.organization || "")
  const [from, setFrom] = useState(filter.from || "")
  const [to, setTo] = useState(filter.to || "")
  const router = useRouter()

  const handleFilter = () => {
    router.push(
      `?${category ? `category=${category}&` : ""}${organization ? `organization=${organization}&` : ""}${from ? `from=${from}&` : ""}${to ? `to=${to}&` : ""}page=1#produits`,
    )
  }

  const handleReset = () => {
    setCategory("")
    setOrganization("")
    setFrom("")
    setTo("")
    router.push(`?page=1#produits`)
  }

  return (
    <div className={styles.filter}>
      <div className={styles.select}>
        <Select
          label='Catégorie de produits'
          nativeSelectProps={{
            value: category,
            onChange: (e) => setCategory(e.target.value),
          }}>
          <option value=''>Toutes les catégories</option>
          {Object.entries(productMapping)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map((category) => (
              <option key={category[1]} value={category[1]}>
                {category[0]}
              </option>
            ))}
        </Select>
      </div>

      <div className={styles.select}>
        <Select
          label='Déclarant'
          nativeSelectProps={{
            value: organization,
            onChange: (e) => setOrganization(e.target.value),
          }}>
          <option value=''>Tous les déclarants</option>
          {organizations
            .sort((a, b) => a.value.localeCompare(b.value))
            .map((org) => (
              <option key={org.key} value={org.key}>
                {org.value}
              </option>
            ))}
        </Select>
      </div>

      <div>
        <p className='fr-label'>Filtrer par date de dernier dépôt</p>
        <div className={styles.dates}>
          <Input
            label='Date de premier dépôt minimum'
            hideLabel
            nativeInputProps={{
              type: "date",
              value: from,
              onChange: (e) => setFrom(e.target.value),
            }}
          />
          <span className='fr-icon-arrow-right-line' />
          <Input
            label='Date de dernier dépôt maximum'
            hideLabel
            nativeInputProps={{
              type: "date",
              value: to,
              onChange: (e) => setTo(e.target.value),
            }}
          />
        </div>
      </div>

      <ButtonsGroup
        inlineLayoutWhen='sm and up'
        buttons={[
          { className: styles.button, onClick: handleFilter, iconId: "ri-search-line", children: "Filtrer" },
          {
            className: styles.button,
            onClick: handleReset,
            priority: "secondary",
            iconId: "ri-refresh-line",
            children: "Réinitialiser",
          },
        ]}
      />
    </div>
  )
}

export default DGCCRFFilter
