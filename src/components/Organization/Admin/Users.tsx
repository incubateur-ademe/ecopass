"use client"

import Table from "../../Table/Table"
import type { AdminOrganizationMember } from "../../../db/organization"
import { Select } from "@codegouvfr/react-dsfr/Select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { OrganizationRole, UserRole } from "@prisma/enums"
import { changeMemberRole, changeOrganizationMemberRole } from "../../../serverFunctions/admin"
import { Alert } from "@codegouvfr/react-dsfr/Alert"

const Users = ({ organizationId, users }: { organizationId: string; users: AdminOrganizationMember[] }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const onOrganizationRoleChange = async (memberId: string, nextRole: OrganizationRole) => {
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
  const onRoleChange = async (memberId: string, nextRole: UserRole) => {
    setLoading(true)
    setError("")
    try {
      const result = await changeMemberRole(memberId, nextRole)
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
    <>
      {error && <Alert severity='error' title='Erreur' description={error} />}
      <Table
        fixed
        headers={["Connexion", "Email", "Nom", "Prénom", "Organisation rôle", "Rôle"]}
        data={users.map((user) => [
          user.accounts.map((a) => a.provider).join(", "),
          user.email,
          user.nom,
          user.prenom,
          <Select
            key={user.id}
            label=''
            nativeSelectProps={{
              "aria-label": "Rôle de l'utilisateur au sein de l'organisation",
              value: user.organizationRole || "",
              disabled: loading,
              onChange: (event) => onOrganizationRoleChange(user.id, event.currentTarget.value as OrganizationRole),
            }}>
            <option value={OrganizationRole.ADMIN}>Admin</option>
            <option value={OrganizationRole.READER}>Lecteur</option>
          </Select>,
          <Select
            key={user.id}
            label=''
            nativeSelectProps={{
              "aria-label": "Rôle de l'utilisateur",
              value: user.role || "",
              disabled: loading,
              onChange: (event) => onRoleChange(user.id, event.currentTarget.value as UserRole),
            }}>
            <option value=''>Aucun</option>
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.BERCY}>Bercy</option>
            <option value={UserRole.DGCCRF}>DGCCRF</option>
          </Select>,
        ])}
      />
    </>
  )
}

export default Users
