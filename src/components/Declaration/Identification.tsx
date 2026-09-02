import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { Input } from "@codegouvfr/react-dsfr/Input"
import Link from "next/link"
import { FormEvent, ReactNode, useRef, useState } from "react"
import styles from "./Identification.module.css"
import { isValidGtin } from "../../utils/validation/gtin"
import BrandAutocomplete from "./BrandAutocomplete"
import { isGTINAlreadyDeclared } from "../../serverFunctions/product"
import { ProductCheckResult } from "../../services/validation/productCheckResult"

const Identification = ({
  data,
  brands,
  setData,
  goToNextStep,
}: {
  data: {
    brandName: string
    brandId?: string
    gtin: string
    internalReference: string
    url: string
  }
  brands: { id: string; name: string }[]
  setData: (key: keyof typeof data, value: string) => void
  goToNextStep: () => void
}) => {
  const [errors, setErrors] = useState<{ [key in keyof typeof data]?: ReactNode }>({})
  const brandNameRef = useRef<HTMLInputElement>(null)
  const gtinRef = useRef<HTMLInputElement>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    let success = true
    const newErrors: { [key in keyof typeof data]?: ReactNode } = {}
    if (!data.gtin) {
      newErrors.gtin = "Le code barre (GTIN) est requis"
      if (success) {
        gtinRef.current?.focus()
      }
      success = false
    } else if (/^\d{8}$|^\d{13}$/.test(data.gtin) === false || !isValidGtin(data.gtin)) {
      newErrors.gtin =
        "Le code GTIN n'est pas valide (doit contenir 8 ou 13 chiffres et avoir une somme de contrôle correcte)"
      if (success) {
        gtinRef.current?.focus()
      }
      success = false
    } else {
      const gtinDeclared = await isGTINAlreadyDeclared(data.gtin, data.brandId)
      if (
        gtinDeclared.result === ProductCheckResult.HigherConfidence ||
        gtinDeclared.result === ProductCheckResult.TooRecent
      ) {
        newErrors.gtin = (
          <>
            {gtinDeclared.result === ProductCheckResult.TooRecent
              ? "Vous avez déjà déclaré ce produit récemment."
              : "Ce produit a déjà été déclaré par sa marque."}{" "}
            <Link href={`/produits/${data.gtin}`}>Voir le produit</Link>
          </>
        )
        if (success) {
          gtinRef.current?.focus()
        }
        success = false
      }
    }

    if (!data.brandName.trim()) {
      newErrors.brandName = "Le nom de la marque est requis"
      if (success) {
        brandNameRef.current?.focus()
      }
      success = false
    }
    setErrors(newErrors)

    if (success) {
      goToNextStep()
    }
  }
  return (
    <>
      <Alert
        severity='warning'
        small
        description='Vous ne pouvez pas encore déclarer de produits des catégories : linge de maison, accessoires, chaussures.'
        className='fr-mb-4w'
      />
      <form onSubmit={submit} noValidate>
        <p className='fr-hint-text fr-mb-4w'>Les champs marqués d'un * sont obligatoires</p>
        <BrandAutocomplete
          brands={brands}
          brandName={data.brandName}
          brandId={data.brandId}
          error={errors.brandName}
          inputRef={brandNameRef}
          onChange={({ brandName, brandId }) => {
            setData("brandName", brandName)
            setData("brandId", brandId)
          }}
        />
        <Input
          label='Code barre (GTIN) *'
          state={errors.gtin ? "error" : undefined}
          stateRelatedMessage={errors.gtin}
          nativeInputProps={{
            required: true,
            value: data.gtin,
            ref: gtinRef,
            onChange: (e) => setData("gtin", e.target.value),
          }}
        />
        <Input
          label='Référence interne (code ou dénomination)'
          nativeInputProps={{
            value: data.internalReference,
            onChange: (e) => setData("internalReference", e.target.value),
          }}
        />
        <Input
          label='URL du produit'
          nativeInputProps={{
            value: data.url,
            onChange: (e) => setData("url", e.target.value),
          }}
        />
        <Alert
          severity='info'
          small
          description={
            <>
              Comment trouver une référence interne ?{" "}
              <Link
                href='https://docs.numerique.gouv.fr/docs/00cbad93-a2b7-4d7d-8e25-1948b4254daf/ '
                target='_blank'
                rel='noopener noreferrer'>
                Consulter la notice
              </Link>
            </>
          }
          className='fr-mb-4w'
        />
        <div className={styles.button}>
          <Button type='submit' priority='secondary' iconId='ri-arrow-right-line' iconPosition='right'>
            Étape suivante
          </Button>
        </div>
      </form>
    </>
  )
}

export default Identification
