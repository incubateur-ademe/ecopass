import { ForwardedRef, forwardRef, ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import Input from "@codegouvfr/react-dsfr/Input"
import Fuse from "fuse.js"
import { productMapping } from "../../utils/ecobalyse/mappings"
import styles from "./CategoryDropdown.module.css"
import { ProductCategory } from "../../types/Product"
import classNames from "classnames"

const subtitles: Record<ProductCategory, string> = {
  [ProductCategory.BoxerSlipTricoté]: "Boxer, culotte, slip, string, tanga, shorty",
  [ProductCategory.CaleçonTissé]: "Caleçon",
  [ProductCategory.Chaussettes]: "Bas, chaussettes, collants, guêtre, jambière, mi-bas",
  [ProductCategory.Chemise]: "Tunique, blouse, chemise, chemise de nuit, chemisier, tunique",
  [ProductCategory.Jean]: "Tout en jean - pantalon, pantacourt, corsaire, knickers, jodhpurs, treillis, chino, sarouel",
  [ProductCategory.JupeRobe]: "Jupe, robe, combinaison, jupe culotte, jupe short, nuisette",
  [ProductCategory.MaillotDeBain]:
    "Maillot de bain 1 pièce, 2 pièces, short de bain, slip de bain, t-shirt de bain, combinaison de bain",
  [ProductCategory.ManteauVeste]:
    "Blouson, boléro, coupe-vent, blazer, gilet de costume, parka, imperméable, kimono, manteau, veste de costume, veste de sport, surchemise, veste tailleur, pilote (bébé)",
  [ProductCategory.PantalonShort]:
    "Bas de pyjama, bermuda, pantacourt, pantalon, salopette, sarouel, short, chino, legging",
  [ProductCategory.Pull]: "Gilet, pull, cardigan, sweatshirt",
  [ProductCategory.TShirtPolo]:
    "T-shirt quelle que soit sa forme : manches courtes ou manches longues, sous-pull, polo, débardeur, haut de pyjama, maillot de corps, top bretelles, body, barboteuse, dors bien (bébé)",
}

const categories = Object.entries(subtitles).map(([key, subtitle]) => ({
  value: productMapping[key as ProductCategory],
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
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState<typeof categories>(categories)
  const [current, setCurrent] = useState(0)

  const fuse = useMemo(
    () =>
      new Fuse(categories, {
        keys: [
          { name: "title", weight: 1 },
          { name: "subtitle", weight: 0.5 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [],
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        e.preventDefault()
        setCurrent(current < filtered.length - 1 ? (prevCurrent) => prevCurrent + 1 : 0)
      }
      if (e.code === "ArrowUp") {
        e.preventDefault()
        if (current > 0) {
          setCurrent((prevCurrent) => prevCurrent - 1)
        }
      }
      if (e.code === "Enter") {
        e.preventDefault()
        const result = filtered[current]
        if (result) {
          setOpen(false)
          setCategory(result.value)
        }
      }
      if (e.code === "Escape") {
        e.preventDefault()
        setOpen(false)
        setSearch("")
        setCategory("")
      }
    },
    [current, filtered, setSearch, setCategory, setOpen],
  )

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", onKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onKeyDown, open])

  const handleSelect = (value: string) => {
    setCategory(value)
    setOpen(false)
  }

  return (
    <div className={styles.dropdown}>
      <Input
        label='Catégorie de produit'
        iconId='fr-icon-search-line'
        ref={ref}
        state={state}
        stateRelatedMessage={stateRelatedMessage}
        nativeInputProps={{
          id: "select-category-input",
          placeholder: placeholder || "Rechercher une catégorie…",
          value:
            (selectedCategory && categories.find((category) => category.value === selectedCategory)?.title) || search,
          onChange: (e) => {
            setCategory("")
            setSearch(e.target.value)
            setOpen(true)
            if (e.target.value.trim() === "") {
              setFiltered(categories)
            } else {
              const result = fuse.search(e.target.value)
              setFiltered(result.map((r) => r.item))
            }
          },
          onFocus: () => {
            setOpen(true)
          },
          role: "combobox",
          "aria-controls": "select-categorie-list",
          "aria-expanded": open,
          "aria-autocomplete": "list",
        }}
      />
      <div className={classNames(styles.dropdownContent, { [styles.open]: open })} id='select-categorie-list'>
        {open && (
          <ul className={styles.categoryList}>
            {filtered.map((item, index) => (
              <li
                key={item.value}
                className={styles.category}
                role='option'
                aria-selected={current === index}
                tabIndex={-1}
                onClick={() => handleSelect(item.value)}>
                <p>
                  <b>{item.title}</b>
                </p>
                <p>{item.subtitle}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default forwardRef(CategoryDropdown)
