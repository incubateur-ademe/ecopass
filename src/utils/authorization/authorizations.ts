import { UserRole } from "@prisma/enums"

export const canAccessAdminSpace = (role?: UserRole | null) => role === UserRole.ADMIN

export const canAccessFullData = (role?: UserRole | null) => {
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.BERCY:
      return true
    default:
      return false
  }
}

export const canViewAsDgccrf = (role?: UserRole | null) => {
  switch (role) {
    case UserRole.DGCCRF:
    case UserRole.ADMIN:
    case UserRole.BERCY:
      return true
    default:
      return false
  }
}

export const canAccessProInformationSpace = (role?: UserRole | null) => {
  switch (role) {
    case UserRole.DGCCRF:
    case UserRole.BERCY:
      return false
    default:
      return true
  }
}

export const canExportFullProducts = (role?: UserRole | null, brandId?: string) => {
  switch (role) {
    case UserRole.DGCCRF:
      return !!brandId
    case UserRole.ADMIN:
    case UserRole.BERCY:
      return true
    default:
      return false
  }
}
