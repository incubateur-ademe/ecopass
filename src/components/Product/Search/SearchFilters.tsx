"use client"
import Select from "@codegouvfr/react-dsfr/Select"
import Input from "@codegouvfr/react-dsfr/Input"
import classNames from "classnames"
import { productMapping } from "../../../utils/ecobalyse/mappings"

const SearchFilters = ({
  brandId,
  category,
  search,
  brands,
  onBrandChange,
  onCategoryChange,
  onSearchChange,
  onSearchSubmit,
}: {
  brandId: string
  category: string
  search: string
  brands: { name: string; id: string }[]
  onBrandChange: (brandId: string) => void
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onSearchSubmit: () => void
}) => {
  return (
    <div className={classNames("fr-grid-row", "fr-grid-row--gutters", "fr-mt-2w")}>
      <div className='fr-col-12'>
        <Input
          label='Recherche'
          hintText='Recherchez par code-barres ou référence interne'
          nativeInputProps={{
            value: search,
            onChange: (e) => onSearchChange(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                onSearchSubmit()
              }
            },
            placeholder: "ex: 1234567890123, REF-123...",
          }}
        />
      </div>
      <div className='fr-col-12 fr-col-md-6'>
        <Select
          label='Marque'
          nativeSelectProps={{
            value: brandId,
            onChange: (e) => onBrandChange(e.target.value),
          }}>
          <option value=''>Toutes les marques</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
      </div>
      <div className='fr-col-12 fr-col-md-6'>
        <Select
          label='Catégorie'
          nativeSelectProps={{
            value: category,
            onChange: (e) => onCategoryChange(e.target.value),
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
    </div>
  )
}

export default SearchFilters
