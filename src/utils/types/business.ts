import { Business } from "../../types/Product"

export const businesses: Record<string, Business> = {
  // Petite entreprise
  smallcompany: Business.Small,
  smallbusiness: Business.Small,
  tpepme: Business.Small,

  // Grande entreprise avec services
  largecompanywithrepairservice: Business.WithServices,
  largebusinesswithservices: Business.WithServices,
  grandeentrepriseavecservicedereparation: Business.WithServices,

  // Grande entreprise sans services
  largecompanywithoutrepairservice: Business.WithoutServices,
  largebusinesswithoutservices: Business.WithoutServices,
  grandeentreprisesansservicedereparation: Business.WithoutServices,
}
