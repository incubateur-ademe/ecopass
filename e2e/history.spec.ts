import { test, expect } from "@playwright/test"
import { login } from "./utils/login"
import { exec } from "child_process"
import { promisify } from "util"
import { formatDate } from "../src/services/format"

const execAsync = promisify(exec)

test.beforeEach(async () => {
  await execAsync("npx prisma db seed")
})

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

test("shows product history", async ({ page }) => {
  await login(page)

  await page.getByRole("link", { name: "API", exact: true }).click()
  await expect(page).toHaveURL(/.*\/api/)

  await page.getByRole("textbox", { name: "Nom de la clé API" }).fill("Ma clé")
  await page.getByRole("button", { name: "Générer une nouvelle clé d'API" }).click()
  const apiKey = await page.getByTestId("new-api-key").textContent()

  let response = await page.request.post("http://localhost:3000/api/produits", {
    data: product,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)
  response = await page.request.post("http://localhost:3000/api/produits", {
    data: { ...product, mass: 0.5 },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)

  await page.goto("http://localhost:3000/produits/1234567890128")

  await expect(page.locator("#contenu")).toContainText("Déclaration validée")
  await expect(page.getByTestId("product-details")).toHaveText(
    `Code-barres : 1234567890128Déposé le : ${formatDate(new Date())}Par : EmmausVersion Ecobalyse : 7.0.0`,
  )
  await expect(page.getByTestId("product-score")).toHaveText(
    "Coût environnemental : 5117 points d'impact, 1023 pour 100g1 023 pts/100g5 117Télécharger le SVGcoût pour 100g : 1 023 pointscoéfficient de durabilité : 0.67 points",
  )

  await expect(page.getByTestId("history-table")).not.toBeVisible()
  await page.getByRole("button", { name: "Voir l'historique du produit" }).click()

  await expect(page.getByTestId("history-table")).toBeVisible()
  await expect(page.getByTestId("history-table").locator("table tbody tr")).toHaveCount(2)

  await page
    .getByTestId("history-table")
    .locator("table tbody tr")
    .nth(1)
    .getByRole("link", { name: "Voir le détail" })
    .click()

  await expect(page.locator("#contenu")).toContainText("Déclaration obsolète")
  await expect(page.getByTestId("product-details")).toHaveText(
    `Code-barres : 1234567890128Déposé le : ${formatDate(new Date())}Par : EmmausVersion Ecobalyse : 7.0.0`,
  )
  await expect(page.getByTestId("product-score")).toHaveText(
    "Coût environnemental : 1755 points d'impact, 1032 pour 100g1 032 pts/100g1 755Télécharger le SVGcoût pour 100g : 1 032 pointscoéfficient de durabilité : 0.67 points",
  )
})
