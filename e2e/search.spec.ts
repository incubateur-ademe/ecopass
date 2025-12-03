import { test, expect } from "@playwright/test"

import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

test.beforeEach(async () => {
  await execAsync("npx prisma db seed")
})
const apiKey = "ce4a461a-ae00-49a9-8fbc-d342dc635da6"
const product = {
  gtins: ["1234567890128"],
  internalReference: "REF-100",
  brandId: "6abd8a2b-8fee-4c54-8d23-17e1f8c27b56",
  mass: 0.17,
  countryDyeing: "IN",
  countryFabric: "CN",
  countryMaking: "MM",
  materials: [
    {
      id: "ei-coton",
      share: 1,
      country: "FR",
    },
  ],
  product: "tshirt",
}

test("Search products", async ({ page }) => {
  await page.request.post("http://localhost:3000/api/produits", {
    data: product,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  await page.request.post("http://localhost:3000/api/produits", {
    data: { ...product, mass: 0.7 },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  await page.request.post("http://localhost:3000/api/produits", {
    data: { ...product, product: "pantalon", internalReference: "REF-101" },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  await page.request.post("http://localhost:3000/api/produits", {
    data: {
      ...product,
      product: "pantalon",
      internalReference: "REF-102",
      brandId: "26ed7820-ebca-4235-b1d3-dbeab02b1768",
    },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  await page.goto("http://localhost:3000/recherche")
  await expect(page.getByTestId("search-results-count")).toHaveText("3 produits trouvés")
  await expect(page.getByTestId("search-results-table").locator("table tbody tr")).toHaveCount(3)

  await expect(page.getByLabel("Marque").locator("option")).toHaveCount(3)
  await page.getByLabel("Marque").selectOption("6abd8a2b-8fee-4c54-8d23-17e1f8c27b56")
  await page.getByRole("button", { name: "Rechercher" }).click()
  await expect(page.getByTestId("search-results-count")).toContainText("2 produits trouvés")
  await expect(page.getByTestId("search-results-table").locator("table tbody tr")).toHaveCount(2)
  await expect(page).toHaveURL("http://localhost:3000/recherche?brandId=6abd8a2b-8fee-4c54-8d23-17e1f8c27b56&page=1")
  await page.getByRole("button", { name: "Réinitialiser" }).click()

  await page.getByLabel("Catégorie").selectOption("T-shirt / Polo")
  await page.getByRole("button", { name: "Rechercher" }).click()
  await expect(page.getByTestId("search-results-count")).toContainText("3 produits trouvés")
  await expect(page.getByTestId("search-results-table").locator("table tbody tr")).toHaveCount(3)
  await expect(page).toHaveURL("http://localhost:3000/recherche?category=tshirt&page=1")
  await page.getByRole("button", { name: "Réinitialiser" }).click()

  await page.getByRole("textbox", { name: "Recherche Recherchez par code" }).fill("ref-101")
  await page.getByRole("button", { name: "Rechercher" }).click()
  await expect(page.getByTestId("search-results-count")).toContainText("1 produit trouvé")
  await expect(page.getByTestId("search-results-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page).toHaveURL("http://localhost:3000/recherche?search=ref-101&page=1")
})
