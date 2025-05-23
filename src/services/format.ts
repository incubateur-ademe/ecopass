export const formatDateTime = (date: Date): string => date.toLocaleString("fr-FR")
export const formatDate = (date: Date): string => date.toLocaleDateString("fr-FR")

export const formatNumber = (number: number | undefined): string =>
  number ? Math.round(number).toLocaleString("fr-FR") : ""
