import { Business } from "../../types/Product"

export const businesses: Record<string, Business> = {
  // Petite entreprise
  smallbusiness: Business.Small,
  tpepme: Business.Small,

  // Grande entreprise avec services
  largebusinesswithservices: Business.WithServices,
  grandeentrepriseavecservicedereparation: Business.WithServices,

  // Grande entreprise sans services
  largebusinesswithoutservices: Business.WithoutServices,
  grandeentreprisesansservicedereparation: Business.WithoutServices,
}
