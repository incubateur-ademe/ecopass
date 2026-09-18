import { ForwardedRef, ReactNode, forwardRef } from "react"
import Dropdown, { DropdownItem } from "./Dropdown"
import { MaterialType } from "../../types/Product"
import { materialMapping } from "../../utils/ecobalyse/mappings"

const materialSubtitles: Record<MaterialType, string | undefined> = {
  [MaterialType.ElasthaneLycra]: undefined,
  [MaterialType.Acrylique]: undefined,
  [MaterialType.Jute]: undefined,
  [MaterialType.Polypropylène]: undefined,
  [MaterialType.Polyester]: undefined,
  [MaterialType.PolyesterRecyclé]: "Autres matières synthétiques recyclées",
  [MaterialType.Nylon]: "Polyamide",
  [MaterialType.Lin]: undefined,
  [MaterialType.LaineParDéfaut]: "Cachemire, Mohair, Alpaga, Soie",
  [MaterialType.LaineNouvelleFilière]: "Laine de Yack",
  [MaterialType.Coton]: undefined,
  [MaterialType.CotonBiologique]: undefined,
  [MaterialType.Chanvre]: undefined,
  [MaterialType.Viscose]: "Lyocell",
  [MaterialType.CotonRecycléDéchetsPostConsommation]: "Autres matières naturelles recyclées",
  [MaterialType.CotonRecycléDéchetsDeProduction]: undefined,
}

const materials: DropdownItem[] = Object.entries(MaterialType).map(([key, label]) => ({
  value: materialMapping[label],
  title: label,
  subtitle: materialSubtitles[label],
}))

const MaterialDropdown = (
  {
    selectedMaterial,
    setMaterial,
    placeholder,
    state,
    stateRelatedMessage,
    label,
  }: {
    selectedMaterial: string
    setMaterial: (value: string) => void
    placeholder?: string
    state?: "success" | "error" | "info" | "default"
    stateRelatedMessage?: ReactNode
    label: string
  },
  ref: ForwardedRef<HTMLInputElement>,
) => {
  return (
    <Dropdown
      ref={ref}
      items={materials}
      selectedValue={selectedMaterial}
      onSelect={setMaterial}
      label={label}
      placeholder={placeholder || "Rechercher une matière…"}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      noMargin
    />
  )
}

export default forwardRef(MaterialDropdown)
