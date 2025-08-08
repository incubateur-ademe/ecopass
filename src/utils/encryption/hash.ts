import hash from "object-hash"
import { ProductAPIValidation } from "../../services/validation/api"
import { ecobalyseVersion } from "../ecobalyse/config"
import { ParsedProduct } from "../../types/Product"

export const hashProduct = (product: ProductAPIValidation | ParsedProduct) =>
  hash({ ...product, ecobalyseVersion, declaredScore: undefined })
