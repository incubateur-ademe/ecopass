"use client"
import { createModal } from "@codegouvfr/react-dsfr/Modal"
import { useRouter } from "next/navigation"
import Button from "@codegouvfr/react-dsfr/Button"
import SiretDelegation from "./SiretDelegation"
import UniqueIdDelegation from "./UniqueIdDelegation"
import styles from "./NewDelegationModal.module.css"
import { SiretAPI } from "../../../types/Siret"
import { useState } from "react"
import { Organization } from "@prisma/client"
import { authorizeOrganization, authorizeOrganizationById } from "../../../serverFunctions/organization"

const modal = createModal({
  id: "create-delegations-modal",
  isOpenedByDefault: false,
})

const NewDelegationModal = () => {
  const router = useRouter()
  const [siretOrganization, setSiretOrganization] = useState<SiretAPI["etablissement"]>()
  const [uniqueIdOrganization, setUniqueIdOrganization] = useState<
    Pick<Organization, "name" | "id"> | null | undefined
  >()

  return (
    <>
      <modal.Component
        title='Déléguer mes droits à une entreprise'
        buttons={
          siretOrganization || uniqueIdOrganization
            ? [
                { children: "Annuler" },
                {
                  children: "Déléguer mes droits à cette organisation",
                  onClick: () => {
                    if (siretOrganization) {
                      authorizeOrganization(siretOrganization.siret).then(() => {
                        setSiretOrganization(undefined)
                        router.refresh()
                      })
                    }
                    if (uniqueIdOrganization) {
                      authorizeOrganizationById(uniqueIdOrganization.id).then(() => {
                        setUniqueIdOrganization(undefined)
                        router.refresh()
                      })
                    }
                  },
                },
              ]
            : [{ children: "Annuler", priority: "secondary" }]
        }>
        <SiretDelegation
          organization={siretOrganization}
          onOrganizationChange={(org) => {
            setSiretOrganization(org)
            setUniqueIdOrganization(undefined)
          }}
        />
        <div className={styles.separator}>
          <span>ou</span>
        </div>
        <UniqueIdDelegation
          organization={uniqueIdOrganization}
          onOrganizationChange={(org) => {
            setSiretOrganization(undefined)
            setUniqueIdOrganization(org)
          }}
        />
      </modal.Component>
      <Button
        priority='secondary'
        iconId='fr-icon-add-line'
        onClick={() => {
          modal.open()
        }}>
        Ajouter un délégataire
      </Button>
    </>
  )
}

export default NewDelegationModal
