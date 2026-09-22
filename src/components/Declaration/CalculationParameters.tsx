"use client"

import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox"
import { Input } from "@codegouvfr/react-dsfr/Input"
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons"
import CategoryDropdown from "../Dropdown/CategoryDropdown"
import CountryDropdown from "../Dropdown/CountryDropdown"
import MaterialDropdown from "../Dropdown/MaterialDropdown"
import { FormEvent, ReactNode, useRef, useState } from "react"
import styles from "./CalculationParameters.module.css"
import LoadingButton from "../Button/LoadingButton"
import { Audience } from "@prisma/enums"
import Link from "next/link"

export const AUDIENCE_LABELS: Record<Audience, string> = {
  Man: "Homme",
  Mixed: "Mixte",
  Woman: "Femme",
  Kid: "Enfant",
  Baby: "Bébé",
}

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
    audience: Audience
    price?: number
    materials: { id: string; share: number }[]
    countryFabric?: string
    countryDyeing?: string
    countryMaking?: string
  }
  setData: (key: keyof typeof data, value: string | number | Audience | typeof data.materials) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  loading: boolean
  error: string
}) => {
  const [errors, setErrors] = useState<{ [key in keyof typeof data | "cgu"]?: ReactNode }>({})
  const [acceptedCGU, setAcceptedCGU] = useState(false)
  const productRef = useRef<HTMLInputElement>(null)
  const cguRef = useRef<HTMLInputElement>(null)
  const materialTypeRefs = useRef<(HTMLInputElement | null)[]>([])
  const materialShareRefs = useRef<(HTMLInputElement | null)[]>([])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    let success = true
    const newErrors: { [key in keyof typeof data | "cgu"]?: ReactNode } = {}

    if (!data.product) {
      newErrors.product = "La catégorie de produit est requise"
      if (success) {
        productRef.current?.focus()
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

    if (!acceptedCGU) {
      newErrors.cgu = "Vous devez accepter les CGU pour valider votre déclaration"
      if (success) {
        cguRef.current?.focus()
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

  return (
    <form onSubmit={submit} noValidate>
      <p className='fr-hint-text fr-mb-4w'>Les champs marqués d'un * sont obligatoires</p>
      <CategoryDropdown
        selectedCategory={data.product}
        setCategory={(value) => setData("product", value)}
        placeholder='Sélectionner une catégorie'
        ref={productRef}
        state={errors.product ? "error" : undefined}
        stateRelatedMessage={errors.product}
      />

      <RadioButtons
        legend='Audience *'
        options={Object.entries(AUDIENCE_LABELS).map(([key, label]) => ({
          label: label,
          nativeInputProps: {
            checked: data.audience === key,
            onChange: () => setData("audience", key),
          },
        }))}
      />

      <Input
        label='Prix du produit'
        hintText='TTC, hors soldes ou promotions, en euros'
        state={errors.price ? "error" : undefined}
        stateRelatedMessage={errors.price}
        nativeInputProps={{
          type: "number",
          min: "0",
          value: data.price && data.price > 0 ? data.price : "",
          onChange: (e) => {
            const parsedPrice = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
            setData("price", Number.isNaN(parsedPrice) ? 0 : parsedPrice)
          },
          placeholder: "par exemple : 10€",
        }}
      />

      <div>
        <h3 className='fr-mt-4w fr-mb-1w'>Étapes de fabrication</h3>
        <p className='fr-hint-text fr-mb-2w'>
          Généralement ces informations se trouvent sur la fiche produit en ligne, ou sont accessibles via un QR code
          sur l'étiquette du vêtement.
        </p>
        <CountryDropdown
          selectedCountry={data.countryFabric || ""}
          setCountry={(value) => setData("countryFabric", value)}
          label='Lieu de tissage / tricotage'
          placeholder='Sélectionner un pays'
          state={errors.countryFabric ? "error" : undefined}
          stateRelatedMessage={errors.countryFabric}
        />

        <CountryDropdown
          selectedCountry={data.countryDyeing || ""}
          setCountry={(value) => setData("countryDyeing", value)}
          label="Lieu d'ennoblissement"
          placeholder='Sélectionner un pays'
          state={errors.countryDyeing ? "error" : undefined}
          stateRelatedMessage={errors.countryDyeing}
        />

        <CountryDropdown
          selectedCountry={data.countryMaking || ""}
          setCountry={(value) => setData("countryMaking", value)}
          label='Lieu de confection'
          placeholder='Sélectionner un pays'
          state={errors.countryMaking ? "error" : undefined}
          stateRelatedMessage={errors.countryMaking}
        />
      </div>
      <h3 className='fr-mt-4w'>Matières premières *</h3>
      {errors.materials && <Alert severity='error' small description={errors.materials} className='fr-mb-4w' />}
      {data.materials.map((material, index) => (
        <div key={index} className={styles.materialRow}>
          <div className={styles.material}>
            <MaterialDropdown
              label={`Matière ${index + 1}`}
              selectedMaterial={material.id}
              setMaterial={(value) => {
                const newMaterials = [...data.materials]
                newMaterials[index] = {
                  ...newMaterials[index],
                  id: value,
                }
                setData("materials", newMaterials)
              }}
              placeholder='Sélectionner une matière'
              ref={(element) => {
                if (element) {
                  materialTypeRefs.current[index] = element
                }
              }}
            />
          </div>

          <Input
            label='Proportion (%)'
            aria-label={`Proportion de la matière ${index + 1} en pourcentage`}
            nativeInputProps={{
              type: "number",
              min: "0",
              max: "100",
              value: material.share > 0 ? material.share : "",
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

      <Checkbox
        className='fr-mt-4w'
        state={errors.cgu ? "error" : undefined}
        stateRelatedMessage={errors.cgu}
        options={[
          {
            label: (
              <span>
                En validant ma déclaration, j'accepte les{" "}
                <Link target='_blank' rel='noopener noreferrer' href='/conditions-generales-utilisation'>
                  conditions générales d'utilisation (CGU)
                </Link>{" "}
                et je certifie que les informations déclarées sont correctes.
              </span>
            ),
            nativeInputProps: {
              ref: cguRef,
              checked: acceptedCGU,
              onChange: (e) => {
                setAcceptedCGU(e.target.checked)
              },
            },
          },
        ]}
      />

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
