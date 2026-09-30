"use client"

import Table from "../Table/Table"
import Select from "@codegouvfr/react-dsfr/Select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { OrganizationMember } from "../../db/organization"
import { changeOrganizationMemberRole } from "../../serverFunctions/admin"
import { OrganizationRole } from "@prisma/enums"
import { Alert } from "@codegouvfr/react-dsfr/Alert"

const OrganizationMembers = ({
  organizationId,
  members,
  isAdmin,
}: {
  organizationId: string
  members: OrganizationMember[]
  isAdmin: boolean
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const onRoleChange = async (memberId: string, nextRole: OrganizationRole) => {
    setLoading(true)
    setError("")
    try {
      const result = await changeOrganizationMemberRole(organizationId, memberId, nextRole)
      if (result === true) {
        router.refresh()
      } else {
        setError(result.error)
      }
    } catch {
      setError("Une erreur est survenue lors de la mise à jour du rôle.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-testid='organization-members-admin'>
      {error && <Alert severity='error' title='Erreur' description={error} />}
      <Table
        noCaption
        caption="Membres de l'organisation"
        headers={["Email", "Nom et prénom", "Droit"]}
        fixed
        data={members.map((member) => [
          member.email,
          [member.prenom, member.nom].filter(Boolean).join(" ") || "-",
          isAdmin ? (
            <Select
              key={member.id}
              label=''
              nativeSelectProps={{
                value: member.organizationRole || "",
                disabled: loading,
                onChange: (event) => onRoleChange(member.id, event.currentTarget.value as OrganizationRole),
              }}>
              <option value={OrganizationRole.ADMIN}>Admin</option>
              <option value={OrganizationRole.READER}>Lecteur</option>
            </Select>
          ) : member.organizationRole === OrganizationRole.ADMIN ? (
            "Admin"
          ) : (
            "Lecteur"
          ),
        ])}
      />
    </div>
  )
}

export default OrganizationMembers
