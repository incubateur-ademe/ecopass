"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@codegouvfr/react-dsfr/Input"
import Table from "../Table/Table"
import Badge from "@codegouvfr/react-dsfr/Badge"
import { ponderations, impactCategories } from "../../utils/product/impacts"
import styles from "./ConverterImpactsTable.module.css"

const ConverterImpactsTable = ({
  results,
  onSubmit,
  readOnly = false,
}: {
  results?: Partial<Record<string, number>>
  onSubmit?: (impacts: Partial<Record<string, number>>) => void
  readOnly?: boolean
}) => {
  const [impacts, setImpacts] = useState<Partial<Record<string, number>>>(results || {})
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    const handleWheel = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target && target.type === "number") {
        target.blur()
      }
    }

    Object.values(inputRefs.current).forEach((input) => {
      if (input) {
        input.addEventListener("wheel", handleWheel, { passive: true })
      }
    })

    return () => {
      Object.values(inputRefs.current).forEach((input) => {
        if (input) {
          input.removeEventListener("wheel", handleWheel)
        }
      })
    }
  }, [])

  const handleImpactChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setImpacts((prev) => ({
      ...prev,
      [key]: numValue,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(impacts)
    }
  }

  const calculatePonderedValue = (key: string, baseValue: number) => {
    const ponderation = ponderations[key as keyof typeof ponderations]
    if (!ponderation) return 0
    return (baseValue / ponderation.base) * ponderation.ponderation * 1_000_000
  }

  const getTotalScore = () => {
    return Object.entries(impacts).reduce((acc, [key, value]) => {
      return acc + calculatePonderedValue(key, value || 0)
    }, 0)
  }

  const renderTableRow = (key: string, label: string) => {
    const baseValue = impacts[key] || 0
    const ponderedValue = calculatePonderedValue(key, baseValue)

    return [
      label,
      readOnly ? (
        <Badge key={label} severity='info' noIcon>
          {baseValue}
        </Badge>
      ) : (
        <Input
          key={label}
          label=''
          nativeInputProps={{
            "aria-label": label,
            type: "number",
            value: baseValue.toString(),
            onChange: (e) => handleImpactChange(key, e.currentTarget.value),
            ref: (el) => {
              if (el) {
                inputRefs.current[key] = el
              }
            },
          }}
        />
      ),
      <Badge key={`ponderated-${label}`} severity='success' noIcon>
        {ponderedValue} pts
      </Badge>,
    ]
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.tablesContainer}>
        {Object.entries(impactCategories).map(([categoryKey, category]) => {
          const categoryImpacts = category.impacts.map((impact) => ({
            key: impact.key,
            label: ponderations[impact.key as keyof typeof ponderations].label,
            definition: impact.definition,
          }))

          return (
            <div key={categoryKey} className={styles.category}>
              <Table
                className='fr-mb-0'
                caption={category.label}
                fixed
                headers={["Nom", "Valeur brute", "Impact pondéré"]}
                data={categoryImpacts.map((impact) => renderTableRow(impact.key, impact.label))}
              />
            </div>
          )
        })}
      </div>

      <div className={styles.summary}>
        <h3>Score total pondéré</h3>
        <div className={styles.scoreDisplay}>
          <Badge severity='success' noIcon>
            {Math.round(getTotalScore())} pts
          </Badge>
        </div>
      </div>
    </form>
  )
}

export default ConverterImpactsTable
