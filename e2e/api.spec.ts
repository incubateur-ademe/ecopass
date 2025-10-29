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
  gtins: ["1234567890128"],
  internalReference: "REF-100",
  brand: "Emmaus",
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

const batch = {
  gtins: ["1234567891125"],
  internalReference: "BATCH-100",
  brand: "Emmaus",
  products: [
    {
      mass: 0.2,
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
    },
    {
      mass: 0.5,
      countryDyeing: "IN",
      countryFabric: "CN",
      countryMaking: "MM",
      materials: [
        {
          id: "ei-pet",
          share: 1,
          country: "CN",
        },
      ],
      product: "pantalon",
    },
  ],
}

test("declare my products by API", async ({ page }) => {
  await login(page)

  await page.getByRole("link", { name: "API", exact: true }).click()
  await expect(page).toHaveURL(/.*\/api/)

  await expect(page.locator("#contenu")).toContainText("Vous n'avez généré aucune clé pour le moment.")

  await expect(page.getByRole("button", { name: "Générer une nouvelle clé d'API" })).toBeDisabled()
  await page.getByRole("textbox", { name: "Nom de la clé API" }).fill("Ma clé")
  await expect(page.getByRole("button", { name: "Générer une nouvelle clé d'API" })).not.toBeDisabled()
  await page.getByRole("button", { name: "Générer une nouvelle clé d'API" }).click()
  const apiKey = await page.getByTestId("new-api-key").textContent()

  let response = await page.request.post("http://localhost:3000/api/produits", {
    data: product,
    headers: {
      Authorization: "Bearer nimps",
    },
  })
  expect(response.status()).toBe(401)

  response = await page.request.post("http://localhost:3000/api/produits/lot", {
    data: batch,
    headers: {
      Authorization: "Bearer nimps",
    },
  })
  expect(response.status()).toBe(401)

  // A first upload should succeed
  response = await page.request.post("http://localhost:3000/api/produits", {
    data: product,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)

  // The  same product should return 208 (Already Reported) and not create a duplicate
  response = await page.request.post("http://localhost:3000/api/produits", {
    data: product,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(208)

  // A first batch upload should succeed
  response = await page.request.post("http://localhost:3000/api/produits/lot", {
    data: batch,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)

  // The  same batch should return 208 (Already Reported) and not create a duplicate
  response = await page.request.post("http://localhost:3000/api/produits/lot", {
    data: batch,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(208)

  // An update should succeed
  response = await page.request.post("http://localhost:3000/api/produits", {
    data: { ...product, mass: 0.18 },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)

  // An batch update should succeed
  response = await page.request.post("http://localhost:3000/api/produits/lot", {
    data: { ...batch, products: [{ ...batch.products[0], mass: 0.18 }, batch.products[1]] },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)

  // Back to the first version should also succeed (3 versions created in total)
  response = await page.request.post("http://localhost:3000/api/produits", {
    data: product,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)

  // Back to the first version should also succeed (3 versions created in total)
  response = await page.request.post("http://localhost:3000/api/produits/lot", {
    data: batch,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(201)

  response = await page.request.post("http://localhost:3000/api/produits", {
    data: { ...product, internalReference: "REF-101", declaredScore: 100.25 },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toEqual(
    '[{"code":"invalid_value","path":["declaredScore"],"message":"Le score déclaré (100.25) ne correspond pas au score calculé (1754.6384371121455)"}]',
  )

  response = await page.request.post("http://localhost:3000/api/produits/lot", {
    data: { ...batch, internalReference: "BATCH-101", declaredScore: 1000.25 },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toEqual(
    '[{"code":"invalid_value","path":["declaredScore"],"message":"Le score déclaré (1000.25) ne correspond pas au score calculé (5346.572472666216)"}]',
  )

  response = await page.request.post("http://localhost:3000/api/produits", {
    data: { ...product, internalReference: "REF-102", mass: undefined },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toEqual(
    '[{"expected":"number","code":"invalid_type","path":["mass"],"message":"Invalid input: expected number, received undefined"}]',
  )

  response = await page.request.post("http://localhost:3000/api/produits/lot", {
    data: {
      ...batch,
      internalReference: "BATCH-102",
      products: [{ ...batch.products[0], mass: undefined }, batch.products[1]],
    },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toEqual(
    '[{"expected":"number","code":"invalid_type","path":["products",0,"mass"],"message":"Invalid input: expected number, received undefined"}]',
  )

  await page.getByRole("link", { name: "Produits déclarés" }).click()
  await expect(page).toHaveURL(/.*\/produits/)

  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(2)

  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(0).locator("td").nth(1)).toHaveText(
    "Lot de produits",
  )
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(0).locator("td").nth(2)).toHaveText(
    "BATCH-100",
  )
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(0).locator("td").nth(3)).toHaveText(
    "5 347",
  )
  await page.getByTestId("products-table").locator("table tbody tr").nth(0).getByRole("link").click()
  await expect(page.getByTestId("product-details")).toHaveText(
    `Lot de produits - EmmausRéférence interne : BATCH-100Code GTINs : 1234567891125Déposé le : ${formatDate(new Date())}Par : EmmausVersion Ecobalyse : ${ecobalyseVersion}`,
  )
  await expect(page.getByTestId("product-score")).toHaveText(
    `Coût environnemental : 5347 pointsCoût environnemental pour 100g : 764 pointsCoût environnemental : 5347 points d'impact, 764 pour 100g764 pts/100g5 347Télécharger le .svg`,
  )

  await page.getByRole("button", { name: "Voir l'historique du produit" }).click()

  await expect(page.getByTestId("history-table").locator("table tbody tr")).toHaveCount(3)
  await expect(page.getByTestId("history-table").locator("table tbody tr").nth(0).locator("td").nth(3)).toHaveText(
    "5347",
  )
  await expect(page.getByTestId("history-table").locator("table tbody tr").nth(1).locator("td").nth(3)).toHaveText(
    "5143",
  )
  await expect(page.getByTestId("history-table").locator("table tbody tr").nth(2).locator("td").nth(3)).toHaveText(
    "5347",
  )

  await page.getByRole("link", { name: "Produits déclarés" }).click()
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(1).locator("td").nth(1)).toHaveText(
    "T-shirt / Polo",
  )
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(1).locator("td").nth(2)).toHaveText(
    "REF-100",
  )
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(1).locator("td").nth(3)).toHaveText(
    "1 755",
  )
  await page.getByTestId("products-table").locator("table tbody tr").nth(1).getByRole("link").click()
  await expect(page.getByTestId("product-details")).toHaveText(
    `T-shirt / Polo - EmmausRéférence interne : REF-100Code GTINs : 1234567890128Déposé le : ${formatDate(new Date())}Par : EmmausVersion Ecobalyse : ${ecobalyseVersion}`,
  )
  await expect(page.getByTestId("product-score")).toHaveText(
    `Coût environnemental : 1755 pointsCoût environnemental pour 100g : 1032 pointsCoefficient de durabilité : 0.67Coût environnemental : 1755 points d'impact, 1032 pour 100g1 032 pts/100g1 755Télécharger le .svg`,
  )

  await page.getByRole("button", { name: "Voir l'historique du produit" }).click()

  await expect(page.getByTestId("history-table").locator("table tbody tr")).toHaveCount(3)
  await expect(page.getByTestId("history-table").locator("table tbody tr").nth(0).locator("td").nth(3)).toHaveText(
    "1755",
  )
  await expect(page.getByTestId("history-table").locator("table tbody tr").nth(1).locator("td").nth(3)).toHaveText(
    "1857",
  )
  await expect(page.getByTestId("history-table").locator("table tbody tr").nth(2).locator("td").nth(3)).toHaveText(
    "1755",
  )

  await page.getByRole("link", { name: "API", exact: true }).click()
  await expect(page).toHaveURL(/.*\/api/)

  await expect(page.getByTestId("api-keys-table").locator("table tbody tr")).toHaveCount(1)
  await page.getByTestId("api-keys-table").locator("table tbody tr").getByRole("button", { name: "Supprimer" }).click()

  await page.reload()

  response = await page.request.post("http://localhost:3000/api/produits", {
    data: product,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(401)
})
