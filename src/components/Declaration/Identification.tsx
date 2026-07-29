import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { Input } from "@codegouvfr/react-dsfr/Input"
import Link from "next/link"
import { FormEvent, ReactNode, useRef, useState } from "react"
import styles from "./Identification.module.css"
import { isValidGtin } from "../../utils/validation/gtin"
import { isGTINAlreadyDeclared } from "../../serverFunctions/product"
import BrandAutocomplete from "./BrandAutocomplete"

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
    let newErrors: { [key in keyof typeof data]?: ReactNode } = {}
    if (!data.gtin) {
      newErrors.gtin = "Le code barre (GTIN) est requis"
      if (success) {
        gtinRef.current?.focus()
      }
      success = false
    }
    if (/^\d{8}$|^\d{13}$/.test(data.gtin) === false || !isValidGtin(data.gtin)) {
      newErrors.gtin =
        "Le code GTIN n'est pas valide (doit contenir 8 ou 13 chiffres et avoir une somme de contrôle correcte)"
      if (success) {
        gtinRef.current?.focus()
      }
      success = false
    }

    const gtinDeclared = await isGTINAlreadyDeclared(data.gtin)
    if (gtinDeclared) {
      newErrors.gtin = (
        <>
          Ce produit a déjà été déclaré par sa marque. <Link href={`/produits/${data.gtin}`}>Voir le produit</Link>
        </>
      )
      if (success) {
        gtinRef.current?.focus()
      }
      success = false
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
        <Alert
          severity='info'
          small
          description={
            <>
              Comment trouver une référence interne ?{" "}
              <Link
                href='https://docs.numerique.gouv.fr/docs/4c19480c-746e-49d9-aa1c-8b94f8790720/'
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
