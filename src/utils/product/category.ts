export const BATCH_CATEGORY = "Lot de produits"

export const getProductCategory = (informations: { categorySlug: string | null; mainComponent: boolean | null }[]) => {
  if (informations.length === 1) {
    return informations[0].categorySlug
  }

  const mainComponent = informations.find((info) => info.mainComponent)
  if (mainComponent) {
    return mainComponent.categorySlug
  }
  return BATCH_CATEGORY
}
