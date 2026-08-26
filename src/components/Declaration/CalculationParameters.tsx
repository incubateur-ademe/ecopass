"use client"

import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { Select } from "@codegouvfr/react-dsfr/Select"
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown"
import { FormEvent, ReactNode, useRef, useState } from "react"
import styles from "./CalculationParameters.module.css"
import { MaterialType, Country } from "../../types/Product"
import LoadingButton from "../Button/LoadingButton"
import { materialMapping, countryMapping } from "../../utils/ecobalyse/mappings"

const materialOptions = Object.entries(MaterialType).map(([, label]) => ({
  label,
  value: materialMapping[label] || label,
}))
const countryOptions = Object.entries(Country).map(([, label]) => ({
  label,
  value: countryMapping[label] || label,
}))

const CalculationParameters = ({
  data,
  setData,
  goToNextStep,
  goToPreviousStep,
  loading,
  error,
}: {
  data: {
    product: string
    mass: number
    materials: { id: string; share: number }[]
    countryFabric: string
    countryDyeing: string
    countryMaking: string
  }
  setData: (key: keyof typeof data, value: string | number | typeof data.materials) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  loading: boolean
  error: string
}) => {
  const [errors, setErrors] = useState<{ [key in keyof typeof data]?: ReactNode }>({})
  const productRef = useRef<HTMLInputElement>(null)
  const massRef = useRef<HTMLInputElement>(null)
  const materialTypeRefs = useRef<(HTMLSelectElement | null)[]>([])
  const materialShareRefs = useRef<(HTMLInputElement | null)[]>([])
  const countryMakingRef = useRef<HTMLSelectElement>(null)
  const countryDyeingRef = useRef<HTMLSelectElement>(null)
  const countryFabricRef = useRef<HTMLSelectElement>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    let success = true
    const newErrors: { [key in keyof typeof data]?: ReactNode } = {}

    if (!data.product) {
      newErrors.product = "La catégorie de produit est requise"
      if (success) {
        productRef.current?.focus()
      }
      success = false
    }

    if (!Number.isFinite(data.mass) || data.mass <= 0) {
      newErrors.mass = "La masse doit être un nombre positif"
      if (success) {
        massRef.current?.focus()
      }
      success = false
    } else if (data.mass > 10000) {
      newErrors.mass = "La masse doit être inférieure ou égale à 10 000 g"
      if (success) {
        massRef.current?.focus()
      }
      success = false
    }

    for (let i = 0; i < data.materials.length; i++) {
      if (data.materials[i].share === 0) {
        break
      }

      if (!data.materials[i].id) {
        newErrors.materials = "La matière première est requise"
        if (success) {
          materialTypeRefs.current[i]?.focus()
        }
        success = false
        break
      }
      if (data.materials[i].share <= 0 || data.materials[i].share > 100) {
        newErrors.materials = "La proportion doit être un nombre entre 0 et 100"
        if (success) {
          materialShareRefs.current[i]?.focus()
        }
        success = false
        break
      }
    }

    const sumOfShares = data.materials.reduce((sum, material) => sum + material.share, 0)
    if (Math.abs(sumOfShares - 100) > 0.01) {
      newErrors.materials = "La somme des proportions doit être égale à 100%"
      if (success) {
        materialTypeRefs.current[0]?.focus()
      }
      success = false
    }

    if (!data.countryMaking) {
      newErrors.countryMaking = "Le lieu de confection est requis"
      if (success) {
        countryMakingRef.current?.focus()
      }
      success = false
    }

    if (!data.countryDyeing) {
      newErrors.countryDyeing = "Le lieu d'ennoblissement est requis"
      if (success) {
        countryDyeingRef.current?.focus()
      }
      success = false
    }

    if (!data.countryFabric) {
      newErrors.countryFabric = "Le lieu de tissage / tricotage est requis"
      if (success) {
        countryFabricRef.current?.focus()
      }
      success = false
    }

    setErrors(newErrors)

    if (success) {
      goToNextStep()
    }
  }

  const addMaterial = () => {
    const newMaterials = [...data.materials, { id: "", share: 0 }]
    setData("materials", newMaterials)
  }

  const removeMaterial = (index: number) => {
    const newMaterials = data.materials.filter((_, i) => i !== index)
    setData("materials", newMaterials)
  }

  console.log("product", data)
  return (
    <form onSubmit={submit} noValidate>
      <CategoryDropdown
        selectedCategory={data.product}
        setCategory={(value) => setData("product", value)}
        placeholder='Sélectionner une catégorie'
        ref={productRef}
        state={errors.product ? "error" : undefined}
        stateRelatedMessage={errors.product}
      />

      <Input
        label='Masse du produit fini (en gramme) *'
        state={errors.mass ? "error" : undefined}
        stateRelatedMessage={errors.mass}
        nativeInputProps={{
          required: true,
          type: "number",
          min: "0",
          max: "10000",
          value: data.mass > 0 ? data.mass : "",
          ref: massRef,
          onChange: (e) => {
            const parsedMass = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
            setData("mass", Number.isNaN(parsedMass) ? 0 : parsedMass)
          },
          placeholder: "par exemple : 250",
        }}
      />

      <Select
        label='Lieu de tissage / tricotage *'
        state={errors.countryFabric ? "error" : undefined}
        stateRelatedMessage={errors.countryFabric}
        nativeSelectProps={{
          required: true,
          value: data.countryFabric,
          ref: countryFabricRef,
          onChange: (e) => setData("countryFabric", e.target.value),
        }}>
        <option value=''>Sélectionner une option</option>
        {countryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        label="Lieu d'ennoblissement *"
        state={errors.countryDyeing ? "error" : undefined}
        stateRelatedMessage={errors.countryDyeing}
        nativeSelectProps={{
          required: true,
          value: data.countryDyeing,
          ref: countryDyeingRef,
          onChange: (e) => setData("countryDyeing", e.target.value),
        }}>
        <option value=''>Sélectionner une option</option>
        {countryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <Select
        label='Lieu de confection *'
        state={errors.countryMaking ? "error" : undefined}
        stateRelatedMessage={errors.countryMaking}
        nativeSelectProps={{
          required: true,
          value: data.countryMaking,
          ref: countryMakingRef,
          onChange: (e) => setData("countryMaking", e.target.value),
        }}>
        <option value=''>Sélectionner une option</option>
        {countryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      <h3>Matières premières *</h3>
      {errors.materials && <Alert severity='error' small description={errors.materials} className='fr-mb-4w' />}
      {data.materials.map((material, index) => (
        <div key={index} className={styles.materialRow}>
          <Select
            label={`Matière ${index + 1}`}
            nativeSelectProps={{
              value: material.id,
              ref: (element) => {
                if (element) {
                  materialTypeRefs.current[index] = element
                }
              },
              onChange: (e) => {
                const newMaterials = [...data.materials]
                newMaterials[index] = {
                  ...newMaterials[index],
                  id: e.target.value,
                }
                setData("materials", newMaterials)
              },
            }}>
            <option value=''>Sélectionner une option</option>
            {materialOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Input
            label={`Proportion ${index + 1} (%)`}
            nativeInputProps={{
              type: "number",
              min: "0",
              max: "100",
              value: material.share,
              ref: (element) => {
                if (element) {
                  materialShareRefs.current[index] = element
                }
              },
              onChange: (e) => {
                const newMaterials = [...data.materials]
                newMaterials[index] = {
                  ...newMaterials[index],
                  share: e.target.value === "" ? 0 : Number.parseFloat(e.target.value),
                }
                setData("materials", newMaterials)
              },
              placeholder: "%",
            }}
          />

          {index > 0 && (
            <Button
              type='button'
              iconId='ri-delete-bin-line'
              priority='secondary'
              onClick={() => removeMaterial(index)}
              title='Supprimer cette matière'></Button>
          )}
        </div>
      ))}

      <Button type='button' onClick={addMaterial} iconId='ri-add-line' priority='secondary'>
        Ajouter une matière
      </Button>

      {error && <Alert severity='error' title={error} className='fr-mt-4w' />}

      <div className={styles.buttons}>
        <Button type='button' priority='secondary' onClick={goToPreviousStep} iconId='ri-arrow-left-line'>
          Étape précédente
        </Button>
        <LoadingButton type='submit' loading={loading}>
          Valider ma déclaration
        </LoadingButton>
      </div>
    </form>
  )
}

export default CalculationParameters
