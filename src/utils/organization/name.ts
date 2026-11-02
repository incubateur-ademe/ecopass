export const displayOrganisationFullName = (organization: { name: string; displayName?: string }) =>
  organization.displayName !== organization.name
    ? `${organization.name} (${organization.displayName})`
    : organization.name
