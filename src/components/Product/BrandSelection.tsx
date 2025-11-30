"use client"

import { Select } from "@codegouvfr/react-dsfr/Select"
import { useRouter } from "next/navigation"

const BrandSelection = ({ brands, brand }: { brands: { name: string; id: string }[]; brand?: string }) => {
  const router = useRouter()
  return (
    <>
      <p className='fr-mb-2w'>
        Vous avez déclaré des produits sur <b>{brands.length} marques différentes.</b>
      </p>
      <Select
        label='Choisir une marque'
        hint='Si vous le souhaitez, vous pouvez sélectionner une marque pour restreindre vos exports.'
        nativeSelectProps={{
          value: brand || "",
          onChange: (e) => router.push(e.target.value ? `/produits?brand=${e.target.value}` : "/produits"),
        }}>
        <option value=''>Toutes les marques</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </Select>
    </>
  )
}

export default BrandSelection
