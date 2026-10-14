import { extractAttribute, mapToProductCategory, matchAudience, matchMaterialType } from "./utils"

const parseComposition = (text: string) => {
  const materials: { id: string; share: number }[] = []

  const materialMatches = text.match(/Tissu principal :(.+)\n/i)

  if (materialMatches) {
    const materialsFound = materialMatches[1].trim().split(";")

    for (const material of materialsFound) {
      const [name, percent] = material.trim().split("  ")
      const percentage = parseFloat(percent.replace(",", ".")) / 100
      const matchedMaterial = matchMaterialType(name)
      materials.push({ id: matchedMaterial, share: percentage })
    }
  }

  return materials
}

export const getPrimarkProduct = (document: Document, url: string) => {
  const title = document.querySelector("h1")?.textContent?.trim() || ""
  const sku = extractAttribute(document, "#sales-panel-wrapper-price", "data-evergage-product-sku")
  const breadCrumbs = document.querySelectorAll("#breadcrumbs-panel li")
  const urls = url.split("-")
  const price = extractAttribute(document, '[data-testautomation-id="product-price"]', "data-evergage-product-price")

  const result = {
    brandName: "Primark",
    gtin: /\d{12}/.test(urls[urls.length - 1]) ? `0${urls[urls.length - 1]}` : "",
    internalReference: sku || "",
    url,
    product: mapToProductCategory(title),
    audience: matchAudience(breadCrumbs[0]?.textContent?.trim()) || undefined,
    price: price ? parseFloat(price) : undefined,
    materials: [] as { id: string; share: number }[],
  }

  const typographies = document.querySelectorAll('[data-testautomation-id="typography"]')
  for (const typography of typographies) {
    const compositionText = typography.textContent || ""
    if (compositionText) {
      const materials = parseComposition(compositionText)
      if (materials.length > 0) {
        result.materials.push(...materials)
        break
      }
    }
  }

  return result
}
