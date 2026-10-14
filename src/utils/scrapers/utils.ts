import Fuse from "fuse.js"
import { categories } from "../../components/Dropdown/categoriesDropdown"
import { materials } from "../../components/Dropdown/materialsDropdown"
import { Audience } from "@prisma/client"
import { audiencelabels } from "../product/audience"

const audienceList = Object.entries(audiencelabels).map(([key, label]) => ({
  value: key as Audience,
  label: label,
}))

export const extractText = (document: Document, selector: string) => {
  try {
    const element = document.querySelector(selector)
    return element?.textContent?.trim() || ""
  } catch {
    return ""
  }
}

export const extractAttribute = (document: Document, selector: string, attribute: string) => {
  const elements = document.querySelectorAll(selector)
  for (const element of elements) {
    const attributeValue = element.getAttribute(attribute)
    if (attributeValue !== null && attributeValue !== undefined) {
      return attributeValue
    }
  }
  return undefined
}

export const mapToProductCategory = (productName: string) => {
  const lowerName = productName.toLowerCase()

  const categoryKeywords = categories.map((cat) => ({
    ...cat,
    keywords: [
      cat.title.toLowerCase(),
      ...(cat.subtitle
        ?.toLowerCase()
        .split(",")
        .map((s) => s.trim()) || []),
    ],
  }))

  let bestMatch = null
  let bestScore = 0

  for (const category of categoryKeywords) {
    let score = 0
    for (const keyword of category.keywords) {
      if (lowerName.includes(keyword)) {
        score += keyword.split(" ").length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = category
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.value
  }

  const fuse = new Fuse(categories, {
    keys: ["title", "subtitle"],
    threshold: 0.6,
    minMatchCharLength: 3,
  })

  const results = fuse.search(productName)

  if (results.length > 0) {
    return results[0].item.value
  }

  return ""
}

export const matchMaterialType = (materialName: string) => {
  const fuse = new Fuse(materials, {
    keys: ["title", "subtitle"],
    threshold: 0.5,
    minMatchCharLength: 2,
  })

  const results = fuse.search(materialName)

  if (results.length > 0) {
    return results[0].item.value
  }

  return ""
}

export const matchAudience = (audienceText: string) => {
  const fuse = new Fuse(audienceList, {
    keys: ["label"],
    threshold: 0.5,
    minMatchCharLength: 2,
  })

  const results = fuse.search(audienceText)

  if (results.length > 0) {
    return results[0].item.value
  }

  return undefined
}
