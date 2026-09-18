import { ForwardedRef, ReactNode, forwardRef, useId, useMemo, useState } from "react"
import Input from "@codegouvfr/react-dsfr/Input"
import Fuse from "fuse.js"
import classNames from "classnames"
import styles from "./Dropdown.module.css"

export interface DropdownItem {
  value: string
  title: string
  subtitle?: string
}

const Dropdown = (
  {
    items,
    selectedValue,
    onSelect,
    label,
    placeholder,
    state,
    stateRelatedMessage,
    searchThreshold = 0.3,
    noMargin,
  }: {
    items: DropdownItem[]
    selectedValue: string
    onSelect: (value: string) => void
    label: string
    placeholder?: string
    state?: "success" | "error" | "info" | "default"
    stateRelatedMessage?: ReactNode
    searchThreshold?: number
    noMargin?: boolean
  },
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const instanceId = useId()
  const listboxId = `dropdown-listbox-${instanceId}`

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState<typeof items>(items)
  const [current, setCurrent] = useState(0)

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 1 },
          { name: "subtitle", weight: 0.5 },
        ],
        threshold: searchThreshold,
        ignoreLocation: true,
      }),
    [items, searchThreshold],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "ArrowDown") {
      e.preventDefault()
      if (!open) {
        setOpen(true)
      }
      setCurrent((prevCurrent) => (prevCurrent < filtered.length - 1 ? prevCurrent + 1 : 0))
    }
    if (e.code === "ArrowUp") {
      e.preventDefault()
      if (!open) {
        setOpen(true)
      }
      if (current > 0) {
        setCurrent((prevCurrent) => prevCurrent - 1)
      }
    }
    if (e.code === "Enter") {
      e.preventDefault()
      if (open && current >= 0) {
        const result = filtered[current]
        if (result) {
          setOpen(false)
          onSelect(result.value)
        }
      }
    }
    if (e.code === "Escape") {
      e.preventDefault()
      setOpen(false)
      setSearch("")
      onSelect("")
    }
  }

  const handleSelect = (value: string) => {
    onSelect(value)
    setOpen(false)
  }

  const selectedItem = items.find((item) => item.value === selectedValue)
  const displayValue = selectedItem?.title || search

  return (
    <div className={styles.dropdown}>
      <Input
        label={label}
        iconId='fr-icon-search-line'
        ref={ref}
        state={state}
        stateRelatedMessage={stateRelatedMessage}
        nativeInputProps={{
          placeholder: placeholder || "Rechercher…",
          value: displayValue,
          onChange: (e) => {
            onSelect("")
            setSearch(e.target.value)
            setOpen(true)
            if (e.target.value.trim() === "") {
              setFiltered(items)
            } else {
              const result = fuse.search(e.target.value)
              setFiltered(result.map((r) => r.item))
            }
            setCurrent(0)
          },
          onFocus: () => {
            setOpen(true)
          },
          onBlur: () => {
            setTimeout(() => {
              setOpen(false)
              setSearch("")
              onSelect("")
            }, 120)
          },
          onKeyDown: handleKeyDown,
          role: "combobox",
          "aria-controls": listboxId,
          "aria-expanded": open,
          "aria-autocomplete": "list",
        }}
      />
      <div
        className={classNames(styles.dropdownContent, { [styles.open]: open, [styles.noMargin]: noMargin })}
        id={listboxId}>
        {open && (
          <ul className={styles.itemList}>
            {filtered.map((item, index) => (
              <li
                key={item.value}
                className={styles.item}
                role='option'
                aria-selected={current === index}
                tabIndex={-1}
                onClick={() => handleSelect(item.value)}>
                <p>
                  <b>{item.title}</b>
                </p>
                {item.subtitle && <p>{item.subtitle}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default forwardRef(Dropdown)
