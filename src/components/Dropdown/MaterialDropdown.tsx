import { ForwardedRef, ReactNode, forwardRef } from "react"
import Dropdown from "./Dropdown"
import { materials } from "./materialsDropdown"

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
