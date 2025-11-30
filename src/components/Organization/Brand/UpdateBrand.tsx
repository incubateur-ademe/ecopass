"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import { createModal } from "@codegouvfr/react-dsfr/Modal"
import { useRouter } from "next/navigation"
import Input from "@codegouvfr/react-dsfr/Input"
import { useMemo, useState } from "react"
import { UserOrganization } from "../../../db/user"
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons"
import Badge from "@codegouvfr/react-dsfr/Badge"
import { updateBrand } from "../../../serverFunctions/brand"

const UpdateBrand = ({ brand }: { brand: UserOrganization["brands"][number] }) => {
  const modal = useMemo(
    () =>
      createModal({
        id: `update-brand-modal-${brand.id}`,
        isOpenedByDefault: false,
      }),
    [brand],
  )

  const router = useRouter()
  const [name, setName] = useState(brand.name)
  const [active, setActive] = useState(brand.active)

  return (
    <>
      <modal.Component
        title='Mise à jour de la marque'
        buttons={[
          { children: "Annuler" },
          {
            children: "Enregistrer",
            onClick: () => updateBrand(brand.id, { name, active }).finally(() => router.refresh()),
          },
        ]}>
        <>
          <Input
            label='Nom'
            nativeInputProps={{
              value: name,
              onChange: (e) => {
                e.preventDefault()
                setName(e.target.value)
              },
            }}
          />
          <RadioButtons
            legend='Statut'
            options={[
              {
                label: <Badge severity='success'>Active</Badge>,
                nativeInputProps: { checked: active, onChange: () => setActive(true) },
              },
              {
                label: <Badge severity='error'>Retirée</Badge>,
                nativeInputProps: { checked: !active, onChange: () => setActive(false) },
              },
            ]}
          />
        </>
      </modal.Component>
      <Button
        priority='secondary'
        iconId='fr-icon-edit-line'
        onClick={() => {
          modal.open()
        }}>
        Modifier
      </Button>
    </>
  )
}

export default UpdateBrand
