import hash from "object-hash"
import { ProductInformationAPI, ProductMetadataAPI } from "../../services/validation/api"
import { ecobalyseVersion } from "../ecobalyse/config"
import { Prisma } from "@prisma/client"
import { ParsedProduct } from "../../types/Product"

const hashProduct = (
  product: Omit<Prisma.ProductCreateInput, "hash" | "upload" | "brand"> & { brandId: string },
  informations: {
    product: string
    airTransportRatio?: string | number | undefined
    business?: string
    fading?: string | boolean | undefined
    mass: string | number | undefined
    numberOfReferences?: string | number | undefined
    price?: string | number | undefined
    countryDyeing?: string
    countryFabric?: string
    countryMaking: string
    countrySpinning?: string
    upcycled?: string | boolean | undefined
    printing?:
      | {
          kind: string
          ratio: string | number | undefined
        }
      | undefined
    materials: {
      id: string
      share: number | string | undefined
      country?: string
    }[]
    trims?:
      | {
          id: string
          quantity: string | number | undefined
        }[]
      | undefined
  }[],
  brands: string[],
) =>
  hash(
    {
      gtins: product.gtins,
      internalReference: product.internalReference,
      declaredScore: product.declaredScore,
      brand: product.brandId,
      informations: informations?.map((informations) => ({
        product: informations.product,
        airTransportRatio: informations.airTransportRatio,
        business: informations.business,
        fading: informations.fading,
        mass: informations.mass,
        numberOfReferences: informations.numberOfReferences,
        price: informations.price,
        countryDyeing: informations.countryDyeing,
        countryFabric: informations.countryFabric,
        countryMaking: informations.countryMaking,
        countrySpinning: informations.countrySpinning,
        upcycled: informations.upcycled,
        printing: informations.printing
          ? { kind: informations.printing.kind, ratio: informations.printing.ratio }
          : undefined,
        materials: informations.materials.map((material) => ({
          id: material.id,
          share: material.share,
          country: material.country,
        })),
        trims: informations.trims?.map((trim) => ({
          id: trim.id,
          quantity: trim.quantity,
        })),
      })),
      ecobalyseVersion,
      brandIncluded: brands.includes(product.brandId),
    },
    { unorderedArrays: true },
  )

export const hashParsedProduct = (product: ProductMetadataAPI, information: ParsedProduct, brands: string[]) =>
  hashProduct(product, [information], brands)

export const hashProductAPI = (product: ProductMetadataAPI, informations: ProductInformationAPI[], brands: string[]) =>
  hashProduct(product, informations, brands)
