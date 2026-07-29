"use client"

import Fuse from "fuse.js"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { Fragment } from "react"
import { useId, useMemo, useState } from "react"
import styles from "./BrandAutocomplete.module.css"
import { ReactNode } from "react"
import classNames from "classnames"

type BrandOption = {
  id: string
  name: string
}

type Suggestion =
  | {
      type: "existing"
      id: string
      name: string
    }
  | {
      type: "create"
      id: "create"
      name: string
    }

const normalize = (value: string) => value.trim().toLocaleLowerCase("fr-FR")

const BrandAutocomplete = ({
  brands,
  brandName,
  brandId,
  onChange,
  inputRef,
  error,
}: {
  brands: BrandOption[]
  brandName: string
  brandId?: string
  onChange: (value: { brandName: string; brandId: string }) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  error?: ReactNode
}) => {
  const instanceId = useId()
  const inputId = `brand-autocomplete-input-${instanceId}`
  const listboxId = `brand-autocomplete-listbox-${instanceId}`

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const fuse = useMemo(
    () =>
      new Fuse(brands, {
        keys: ["name"],
        threshold: 0.35,
      }),
    [brands],
  )

  const trimmedQuery = brandName.trim()
  const normalizedQuery = normalize(trimmedQuery)

  const exactMatch = useMemo(
    () => brands.find((brand) => normalize(brand.name) === normalizedQuery),
    [brands, normalizedQuery],
  )

  const results = useMemo(() => {
    if (!trimmedQuery) {
      return brands.slice(0, 6)
    }

    return fuse.search(trimmedQuery, { limit: 6 }).map((result) => result.item)
  }, [brands, fuse, trimmedQuery])

  const suggestions = useMemo(() => {
    const existingSuggestions: Suggestion[] = results.map((brand) => ({
      type: "existing",
      id: brand.id,
      name: brand.name,
    }))

    if (trimmedQuery && !exactMatch) {
      existingSuggestions.push({
        type: "create",
        id: "create",
        name: trimmedQuery,
      })
    }

    return existingSuggestions
  }, [results, trimmedQuery, exactMatch])

  const optionId = (index: number) => `brand-autocomplete-option-${instanceId}-${index}`

  const selectExistingBrand = (brand: BrandOption) => {
    onChange({ brandName: brand.name, brandId: brand.id })
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const selectNewBrand = () => {
    onChange({ brandName: trimmedQuery, brandId: "" })
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const selectSuggestion = (suggestion: Suggestion) => {
    if (suggestion.type === "existing") {
      selectExistingBrand({ id: suggestion.id, name: suggestion.name })
      return
    }

    selectNewBrand()
  }

  const moveActive = (delta: number) => {
    if (suggestions.length === 0) {
      return
    }

    setActiveIndex((current) => {
      if (current === -1) {
        return delta > 0 ? 0 : suggestions.length - 1
      }

      const nextIndex = current + delta
      if (nextIndex < 0) {
        return suggestions.length - 1
      }
      if (nextIndex >= suggestions.length) {
        return 0
      }
      return nextIndex
    })
  }

  return (
    <div className={styles.container}>
      <Input
        label='Nom de la marque *'
        state={error ? "error" : undefined}
        stateRelatedMessage={error}
        iconId='fr-icon-search-line'
        nativeInputProps={{
          id: inputId,
          ref: inputRef,
          required: true,
          role: "combobox",
          "aria-autocomplete": "list",
          "aria-expanded": isOpen && suggestions.length > 0,
          "aria-controls": listboxId,
          "aria-activedescendant": isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined,
          value: brandName,
          onChange: (e) => {
            onChange({ brandName: e.target.value, brandId: "" })
            setIsOpen(true)
            setActiveIndex(-1)
          },
          onFocus: () => {
            setIsOpen(true)
          },
          onBlur: () => {
            setTimeout(() => {
              setIsOpen(false)
              setActiveIndex(-1)
            }, 120)
          },
          onKeyDown: (event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              if (!isOpen) {
                setIsOpen(true)
              }
              moveActive(1)
              return
            }

            if (event.key === "ArrowUp") {
              event.preventDefault()
              if (!isOpen) {
                setIsOpen(true)
              }
              moveActive(-1)
              return
            }

            if (event.key === "Home" && suggestions.length > 0) {
              event.preventDefault()
              setActiveIndex(0)
              return
            }

            if (event.key === "End" && suggestions.length > 0) {
              event.preventDefault()
              setActiveIndex(suggestions.length - 1)
              return
            }

            if (event.key === "Enter" && isOpen && activeIndex >= 0) {
              event.preventDefault()
              selectSuggestion(suggestions[activeIndex])
              return
            }

            if (event.key === "Escape") {
              setIsOpen(false)
              setActiveIndex(-1)
            }
          },
          autoComplete: "off",
        }}
      />

      {isOpen && suggestions.length > 0 && (
        <div
          id={listboxId}
          className={classNames(styles.dropdown, { [styles.dropDownError]: error })}
          role='listbox'
          aria-label='Résultats de recherche de marques'>
          {suggestions.map((suggestion, index) => {
            const isCreate = suggestion.type === "create"
            const checked = !isCreate && brandId === suggestion.id
            const active = activeIndex === index

            return (
              <Fragment key={`${suggestion.type}-${suggestion.id}-${suggestion.name}`}>
                {isCreate && <p className={styles.createLabel}>Marque non disponible</p>}
                <div
                  id={optionId(index)}
                  role='option'
                  aria-selected={checked}
                  className={`${styles.option} ${active ? styles.optionActive : ""}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectSuggestion(suggestion)}>
                  <span className={styles.radio} data-selected={checked} aria-hidden='true' />
                  <span className={styles.optionText}>
                    {isCreate ? `Ajouter la marque "${suggestion.name}"` : suggestion.name}
                  </span>
                </div>
              </Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BrandAutocomplete
