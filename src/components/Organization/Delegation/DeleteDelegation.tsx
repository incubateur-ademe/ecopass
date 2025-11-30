"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import { createModal } from "@codegouvfr/react-dsfr/Modal"
import { useRouter } from "next/navigation"
import { removeOrganizationAuthorization } from "../../../serverFunctions/organization"

const modal = createModal({
  id: "delete-delegations-modal",
  isOpenedByDefault: false,
})

const DeleteDelegation = ({ id, name }: { id: string; name: string }) => {
  const router = useRouter()
  return (
    <>
      <modal.Component
        title="Suppression d'une délégation"
        buttons={[
          { children: "Annuler" },
          {
            children: "Confirmer la suppression",
            onClick: () => removeOrganizationAuthorization(id).finally(() => router.refresh()),
          },
        ]}>
        <p>Vous êtes sur le point de supprimer la délégation pour l'entreprise "{name}".</p>
        <br />
        <p>Elle ne pourra plus déclarer de produits pour votre marque.</p>
        <br />
        <p>NB : les produits déjà déclarés par cette entité ne seront pas impactés.</p>
      </modal.Component>
      <Button
        priority='secondary'
        iconId='fr-icon-delete-bin-fill'
        onClick={() => {
          modal.open()
        }}>
        Supprimer
      </Button>
    </>
  )
}

export default DeleteDelegation
