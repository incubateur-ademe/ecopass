import { v4 as uuid } from "uuid"
import {
  AccessoryType,
  Business,
  MaterialType,
  ProductType,
  ProductWithMaterialsAndAccessories,
} from "../../types/Product"
import { Status } from "../../../prisma/src/prisma"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseJson = (json: any[], uploadId: string) => {
  return json.map((item) => {
    const productId = uuid()
    const now = new Date()

    const product: ProductWithMaterialsAndAccessories = {
      id: productId,
      createdAt: now,
      updatedAt: now,
      uploadId,
      status: Status.Pending,
      ean: item.ean,
      date: new Date(item.date),
      type: ProductType.Pull,
      airTransportRatio: item.airTransportRatio,
      business: Business.Small,
      fading: item.fading,
      mass: item.mass,
      numberOfReferences: item.numberOfReferences,
      price: item.price,
      traceability: item.traceability,
      countryDyeing: item.countryDyeing,
      countryFabric: item.countryFabric,
      countryMaking: item.countryMaking,
      countrySpinning: item.countrySpinning,
      impression: item.printing ? item.printing.kind : undefined,
      impressionPercentage: item.printing ? item.printing.ratio : undefined,
      upcycled: item.upcycled,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accessories: item.trims.map((accessory: any) => ({ ...accessory, productId, slug: AccessoryType.BoutonEnMétal })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      materials: item.materials.map((material: any) => ({ ...material, productId, slug: MaterialType.Acrylique })),
    }

    return product
  })
}
