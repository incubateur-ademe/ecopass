import { test, expect } from "@playwright/test"
import { login } from "./utils/login"
import { exec } from "child_process"
import { promisify } from "util"
import { formatDate } from "../src/services/format"
import { ecobalyseVersion } from "../src/utils/ecobalyse/config"

const execAsync = promisify(exec)

test.beforeEach(async () => {
  await execAsync("npx prisma db seed")
})

const product = {
  gtins: ["1234567890123"],
  internalReference: "REF-100",
  date: "2023-10-01",
  marque: "Emmaus",
  mass: 0.17,
  materials: [
    {
      id: "ei-coton",
      share: 1,
      country: "FR",
    },
  ],
  product: "tshirt",
}

test("declare my products by API", async ({ page }) => {
  await login(page)

  await page.getByRole("link", { name: "API" }).click()
  await expect(page).toHaveURL(/.*\/api/)

  await expect(page.locator("#contenu")).toContainText("Vous n'avez généré aucune clé pour le moment.")

  await expect(page.getByRole("button", { name: "Générer une nouvelle clé d'API" })).toBeDisabled()
  await page.getByRole("textbox", { name: "Nom de la clé API" }).fill("Ma clé")
  await expect(page.getByRole("button", { name: "Générer une nouvelle clé d'API" })).not.toBeDisabled()
  await page.getByRole("button", { name: "Générer une nouvelle clé d'API" }).click()
  const apiKey = await page.getByTestId("new-api-key").textContent()

  let response = await page.request.post("http://localhost:3000/api/produit", {
    data: product,
    headers: {
      Authorization: "Bearer nimps",
    },
  })
  expect(response.status()).toBe(401)

  response = await page.request.post("http://localhost:3000/api/produit", {
    data: product,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)

  response = await page.request.post("http://localhost:3000/api/produit", {
    data: { ...product, internalReference: "REF-101", declaredScore: 100 },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toEqual('{"error":"Le score déclaré ne correspond pas au score calculé."}')

  response = await page.request.post("http://localhost:3000/api/produit", {
    data: { ...product, internalReference: "REF-102", mass: undefined },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toEqual(
    '[{"code":"invalid_type","expected":"number","received":"undefined","path":["mass"],"message":"Required"}]',
  )

  await page.getByRole("link", { name: "Mes produits" }).click()
  await expect(page).toHaveURL(/.*\/produits/)

  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(0).locator("td").nth(2)).toHaveText(
    "REF-100",
  )
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(0).locator("td").nth(3)).toHaveText(
    "1 777",
  )
  await page.getByTestId("products-table").locator("table tbody tr").nth(0).getByRole("link").click()
  await expect(page.getByTestId("product-details")).toHaveText(
    `tshirt - EmmausRéférence interne : REF-100Code GTINs : 1234567890123Déposé le : ${formatDate(new Date())}Par : Xavier Ecopass (Emmaus)Version Ecobalyse : ${ecobalyseVersion}`,
  )
  await expect(page.getByTestId("product-score")).toHaveText(
    `Coût environnemental : 1777 pointsCoût environnemental pour 100g : 1045 pointsIndice de durabilité : 0.671 045 pts/100g1 777Télécharger le .svg`,
  )

  await page.getByRole("link", { name: "API" }).click()
  await expect(page).toHaveURL(/.*\/api/)

  await expect(page.getByTestId("api-keys-table").locator("table tbody tr")).toHaveCount(1)
  await page.getByTestId("api-keys-table").locator("table tbody tr").getByRole("button", { name: "Supprimer" }).click()

  await page.reload()

  response = await page.request.post("http://localhost:3000/api/produit", {
    data: product,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(401)
})
