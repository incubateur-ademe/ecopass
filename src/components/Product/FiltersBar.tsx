"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Select from "@codegouvfr/react-dsfr/Select"
import Input from "@codegouvfr/react-dsfr/Input"
import styles from "./FiltersBar.module.css"
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup"
import { ProductFilters } from "../../db/product"

const FiltersBar = ({
  brands,
  categories,
  declarants,
  filters,
}: {
  brands: { name: string; id: string }[]
  categories: string[]
  declarants: string[]
  filters: ProductFilters
}) => {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState(filters.search || "")
  const [selectedBrand, setSelectedBrand] = useState(filters.brandId || "")
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "")
  const [selectedDeclarant, setSelectedDeclarant] = useState(filters.declarant || "")
  const [dateFrom, setDateFrom] = useState(filters.dateFrom)
  const [dateTo, setDateTo] = useState(filters.dateTo)

  const handleFilter = () => {
    const params = new URLSearchParams()

    if (searchQuery) {
      params.set("search", searchQuery)
    }
    if (selectedBrand) {
      params.set("brand", selectedBrand)
    }
    if (selectedCategory) {
      params.set("category", selectedCategory)
    }
    if (selectedDeclarant) {
      params.set("declarant", selectedDeclarant)
    }
    if (dateFrom) {
      params.set("dateFrom", dateFrom.toISOString())
    }
    if (dateTo) {
      params.set("dateTo", dateTo.toISOString())
    }

    router.push(`/produits?${params.toString()}`)
  }

  const handleReset = () => {
    setSearchQuery("")
    setSelectedBrand("")
    setSelectedCategory("")
    setSelectedDeclarant("")
    setDateFrom(undefined)
    setDateTo(undefined)

    router.push("/produits")
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <Input
          label='Saisir un code-barres ou une référence produit'
          nativeInputProps={{
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: "ex: 1234567890123, REF-123...",
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                handleFilter()
              }
            },
          }}
        />
        <Select
          label='Catégorie de produits'
          nativeSelectProps={{
            value: selectedCategory,
            onChange: (e) => setSelectedCategory(e.target.value),
          }}>
          <option value=''>Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Select
          label='Déclarant'
          nativeSelectProps={{
            value: selectedDeclarant,
            onChange: (e) => setSelectedDeclarant(e.target.value),
          }}>
          <option value=''>Tous les déclarants</option>
          {declarants.map((declarant) => (
            <option key={declarant} value={declarant}>
              {declarant}
            </option>
          ))}
        </Select>

        <Select
          label='Marque'
          nativeSelectProps={{
            value: selectedBrand,
            onChange: (e) => setSelectedBrand(e.target.value),
          }}>
          <option value=''>Toutes les marques</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
        <div>
          <p className='fr-label'>Filtrer par période de dernier dépôt</p>
          <div className={styles.dateInputs}>
            <Input
              label='Début de date de dépôt'
              hideLabel
              nativeInputProps={{
                type: "date",
                value: dateFrom?.toISOString().split("T")[0] ?? "",
                onChange: (e) => setDateFrom(e.target.value ? new Date(e.target.value) : undefined),
              }}
            />
            <span className={styles.dateSeparator}>-</span>
            <Input
              label='Fin de date de dépôt'
              hideLabel
              nativeInputProps={{
                type: "date",
                value: dateTo?.toISOString().split("T")[0] ?? "",
                onChange: (e) => setDateTo(e.target.value ? new Date(e.target.value) : undefined),
              }}
            />
          </div>
        </div>
      </div>

      <ButtonsGroup
        className={styles.buttons}
        inlineLayoutWhen='always'
        buttons={[
          {
            children: "Filtrer",
            onClick: handleFilter,
            priority: "primary",
            iconId: "ri-search-line",
          },
          {
            children: "Réinitialiser",
            onClick: handleReset,
            priority: "secondary",
            iconId: "ri-refresh-line",
          },
        ]}
      />
    </div>
  )
}

export default FiltersBar
