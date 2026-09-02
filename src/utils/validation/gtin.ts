import { Organization } from "@prisma/client"
import { v4 as uuid } from "uuid"

export const isValidGtin = (gtin: string): boolean => {
  const digits = (gtin.length === 12 ? `0${gtin}` : gtin).split("").map(Number)

  let sum = 0
  let multiplier = 3
  for (let i = digits.length - 2; i >= 0; i--) {
    sum += digits[i] * multiplier
    multiplier = multiplier === 3 ? 1 : 3
  }

  const calculatedCheckDigit = (10 - (sum % 10)) % 10

  return digits[digits.length - 1] === calculatedCheckDigit
}

export const getDefaultGTINs = (
  organization: Pick<Organization, "siret" | "uniqueId" | "id">,
  internalReference: string,
) => {
  const sanitizedInternalReference = internalReference
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "")

  const suffix = organization.siret || (organization.uniqueId || organization.id).slice(0, 8)
  return [`${sanitizedInternalReference || uuid()}-${suffix}`]
}
