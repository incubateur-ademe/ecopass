export const formatDateTime = (date: Date): string => date.toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
export const formatDate = (date: Date): string => date.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })

export const formatNumber = (number: number | undefined): string =>
  number ? Math.round(number).toLocaleString("fr-FR") : ""
