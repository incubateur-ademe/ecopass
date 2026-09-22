import { ForwardedRef, ReactNode, forwardRef } from "react"
import Dropdown, { DropdownItem } from "./Dropdown"
import { productMapping } from "../../utils/ecobalyse/mappings"
import { ProductCategory } from "../../types/Product"

const subtitles: Record<string, string> = {
  [ProductCategory.BoxerSlipTricoté]: "Boxer, culotte, slip, string, tanga, shorty",
  [ProductCategory.CaleçonTissé]: "Caleçon",
  [ProductCategory.Chaussettes]: "Bas, chaussettes, collants, guêtre, jambière, mi-bas",
  [ProductCategory.Chemise]: "Tunique, blouse, chemise, chemise de nuit, chemisier",
  [ProductCategory.Jean]: "Tout en jean - pantalon, pantacourt, corsaire, knickers, jodhpurs, treillis, chino, sarouel",
  Jupe: "Jupe, jupe culotte, jupe short",
  Robe: "Robe, combinaison, nuisette",
  [ProductCategory.MaillotDeBain]:
    "Maillot de bain 1 pièce, 2 pièces, short de bain, slip de bain, t-shirt de bain, combinaison de bain",
  Imperméable: "Coupe-vent, imperméable",
  Manteau: "Blouson, parka, manteau",
  Veste:
    "Boléro, blazer, gilet de costume, kimono, veste de costume, veste de sport, surchemise, veste tailleur, pilote (bébé)",
  Pantalon: "Bas de pyjama, pantalon, salopette, sarouel, chino, legging",
  Short: "Short, bermuda, pantacourt",
  [ProductCategory.Pull]: "Gilet, pull, cardigan, sweatshirt",
  [ProductCategory.TShirtPolo]:
    "T-shirt quelle que soit sa forme : manches courtes ou manches longues, sous-pull, polo, débardeur, haut de pyjama, maillot de corps, top bretelles, body, barboteuse, dors bien (bébé)",
}

const categories: DropdownItem[] = Object.entries(subtitles).map(([key, subtitle]) => ({
  value: productMapping[key as ProductCategory] || key,
  title: key,
  subtitle: subtitle,
}))

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
