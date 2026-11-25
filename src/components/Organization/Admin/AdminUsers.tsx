"use server"

import { getAdminOrganizationMembers } from "../../../db/organization"
import { tryAndGetSession } from "../../../services/auth/redirect"
import { UserRole } from "@prisma/client"
import Users from "./Users"

const AdminUsers = async ({ id }: { id: string }) => {
  const session = await tryAndGetSession(false, false)
  if (!session || session.user.role !== UserRole.ADMIN) {
    return null
  }
  const users = await getAdminOrganizationMembers(id)
  return <Users organizationId={id} users={users} />
}

export default AdminUsers
