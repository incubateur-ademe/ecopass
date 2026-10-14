import { ForwardedRef, ReactNode, forwardRef } from "react"
import Dropdown from "./Dropdown"
import { categories } from "./categoriesDropdown"

const CategoryDropdown = (
  {
    selectedCategory,
    setCategory,
    placeholder,
    state,
    stateRelatedMessage,
  }: {
    selectedCategory: string
    setCategory: (value: string) => void
    placeholder?: string
    state?: "success" | "error" | "info" | "default"
    stateRelatedMessage?: ReactNode
  },
  ref: ForwardedRef<HTMLInputElement>,
) => {
  return (
    <Dropdown
      ref={ref}
      items={categories}
      selectedValue={selectedCategory}
      onSelect={setCategory}
      label='Catégorie de produit *'
      placeholder={placeholder || "Rechercher une catégorie…"}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
    />
  )
}

export default forwardRef(CategoryDropdown)
