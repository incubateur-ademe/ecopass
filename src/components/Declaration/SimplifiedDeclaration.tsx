"use client"

import { useState } from "react"
import Identification from "./Identification"
import CalculationParameters from "./CalculationParameters"
import Validation from "./Validation"
import { Stepper } from "@codegouvfr/react-dsfr/Stepper"
import styles from "./SimplifiedDeclaration.module.css"
import { Tile } from "@codegouvfr/react-dsfr/Tile"
import { createProductFromSimplifiedDeclaration, SimplifiedDeclarationData } from "../../serverFunctions/upload"

const steps: Record<number, string> = {
  1: "Identification du produit",
  2: "Paramètres de calcul",
  3: "Validation",
}

const SimplifiedDeclaration = ({ brands }: { brands: { id: string; name: string }[] }) => {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SimplifiedDeclarationData>({
    brandName: "",
    brandId: "",
    gtin: "",
    internalReference: "",
    url: "",
    product: "",
    mass: 0,
    materials: [{ id: "", share: 100 }],
    countryFabric: "",
    countryDyeing: "",
    countryMaking: "",
  })
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState({ score: 0, standardized: 0 })
  const [error, setError] = useState<string>("")

  const handleChange = (field: keyof typeof data, value: string | number | typeof data.materials) => {
    setData((current) => ({ ...current, [field]: value }))
  }

  const submitProduct = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await createProductFromSimplifiedDeclaration({
        ...data,
        materials: data.materials
          .filter((material) => material.share > 0)
          .map((material) => ({ id: material.id, share: material.share / 100 })),
      })
      if (response.success) {
        setScore(response.score || { score: 0, standardized: 0 })
        setStep(3)
      } else {
        setError(response.error || "Une erreur est survenue lors de la création du produit")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Stepper currentStep={step} stepCount={3} title={steps[step]} />
      <div className={styles.formContainer}>
        <div className={styles.form}>
          {step === 1 && (
            <Identification data={data} brands={brands} setData={handleChange} goToNextStep={() => setStep(2)} />
          )}
          {step === 2 && (
            <CalculationParameters
              data={data}
              setData={handleChange}
              goToNextStep={() => submitProduct()}
              goToPreviousStep={() => setStep(1)}
              loading={loading}
              error={error}
            />
          )}
          {step === 3 && (
            <Validation
              score={score.score}
              standardized={score.standardized}
              gtin={data.gtin}
              reset={() => {
                setScore({ score: 0, standardized: 0 })
                setData({
                  brandName: "",
                  brandId: "",
                  gtin: "",
                  internalReference: "",
                  url: "",
                  product: "",
                  mass: 0,
                  materials: [{ id: "", share: 100 }],
                  countryFabric: "",
                  countryDyeing: "",
                  countryMaking: "",
                })
                setError("")
                setStep(1)
              }}
            />
          )}
        </div>
        {step < 3 && (
          <Tile
            className={styles.helpTile}
            title='Comment trouver les informations nécessaires à la déclaration de données'
            imageUrl='/images/document-search.svg'
            imageAlt=''
            titleAs='h2'
            desc="Consultez l'aide en ligne"
            linkProps={{
              href: "https://docs.numerique.gouv.fr/docs/00cbad93-a2b7-4d7d-8e25-1948b4254daf/ ",
              target: "_blank",
              rel: "noopener noreferrer",
            }}
            small
          />
        )}
      </div>
    </div>
  )
}

export default SimplifiedDeclaration
