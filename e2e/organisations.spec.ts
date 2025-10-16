import { test, expect } from "@playwright/test"
import { exec } from "child_process"
import { promisify } from "util"
import { login, logout } from "./utils/login"
import { retry } from "./utils/retry"

const product = {
  gtins: ["1234567890128"],
  internalReference: "REF-099",
  brand: "Emmaus Connect",
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

const execAsync = promisify(exec)

test.beforeEach(async () => {
  await execAsync("npx prisma db seed")
})

test("manage brands", async ({ page }) => {
  await login(page)

  await page.getByRole("link", { name: "Mon organisation" }).click()
  await expect(page).toHaveURL(/.*\/organisation/)

  await expect(page.getByTestId("brand-row-name")).toHaveCount(2)
  await expect(page.getByTestId("brand-row-name").first()).toHaveText("Emmaus Solidarité")

  await page.getByRole("textbox", { name: "Nom de la marque" }).fill("Ma nouvelle marque")
  await page.getByRole("button", { name: "Ajouter une nouvelle marque" }).click()

  await expect(page.getByTestId("brand-row-name")).toHaveCount(3)
  await expect(page.getByTestId("brand-row-name").last()).toHaveText("Ma nouvelle marque")
  await page.getByRole("row", { name: "Ma nouvelle marque Supprimer" }).getByRole("button").click()
  await page.getByRole("row", { name: "Emmaus Solidarité Supprimer" }).getByRole("button").click()
  await page.getByRole("row", { name: "Emmaus Connect" }).getByRole("button").click()

  await expect(page.locator("#contenu")).toContainText("Vous n'avez pas encore déclaré de marques.")
})

test("manage delegation", async ({ page }) => {
  await login(page, "ecopass-no-organization@yopmail.com")

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
  expect(response.status()).toBe(400)
  expect(await response.text()).toEqual(
    '[{"code":"invalid_value","values":["DEPARTEMENT DE SEINE ET MARNE"],"path":["brand"],"message":"Invalid input: expected \\"DEPARTEMENT DE SEINE ET MARNE\\""}]',
  )

  await logout(page)
  await login(page)

  await page.getByRole("link", { name: "Mon organisation" }).click()
  await expect(page).toHaveURL(/.*\/organisation/)

  await expect(page.locator("h1").last()).toHaveText("Mon organisation Emmaus")
  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr")).toHaveCount(0)
  await expect(page.getByTestId("from-delegations-table").locator("table tbody tr")).toHaveCount(0)

  await expect(page.getByTestId("organization-card")).not.toBeVisible()
  await page.getByRole("textbox", { name: "SIRET" }).fill("22770001000555")
  await expect(page.getByTestId("organization-card")).toBeVisible()
  await expect(page.getByTestId("organization-card")).toHaveText(
    "DEPARTEMENT DE SEINE ET MARNE25 AVENUE DU GENDARME CASTERMANT, 77500 CHELLESDéléguer mes droits à cette organisation ",
  )
  await page
    .getByTestId("organization-card")
    .getByRole("button", { name: "Déléguer mes droits à cette organisation" })
    .click()
  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr").locator("td").nth(1)).toHaveText(
    "22770001000555",
  )
  await expect(page.getByTestId("from-delegations-table").locator("table tbody tr")).toHaveCount(0)

  await retry(async () => {
    response = await page.request.post("http://localhost:3000/api/produits", {
      data: { ...product, internalReference: "REF-098" },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    expect(response.status()).toBe(201)
  }, 3)

  await retry(async () => {
    response = await page.request.get("http://localhost:3000/api/organisation", {
      headers: {
        Authorization: "nimps",
      },
    })
    expect(response.status()).toBe(401)
  }, 3)

  await retry(async () => {
    response = await page.request.get("http://localhost:3000/api/organisation", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({
      name: "DEPARTEMENT DE SEINE ET MARNE",
      brands: [],
      authorizedBy: [
        {
          createdAt: expect.any(String),
          name: "Emmaus",
          siret: "31723624800017",
          brands: ["Emmaus Solidarité", "Emmaus Connect"],
        },
      ],
      authorizeOrganization: [],
    })
  }, 3)

  await logout(page)
  await login(page, "ecopass-no-organization@yopmail.com")

  await page.getByRole("link", { name: "Mon organisation" }).click()
  await expect(page).toHaveURL(/.*\/organisation/)

  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr")).toHaveCount(0)
  await expect(page.getByTestId("from-delegations-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page.getByTestId("from-delegations-table").locator("table tbody tr").locator("td").nth(1)).toHaveText(
    "31723624800017",
  )

  await logout(page)
  await login(page)

  await page.getByRole("link", { name: "Mon organisation" }).click()
  await expect(page).toHaveURL(/.*\/organisation/)

  await page
    .getByTestId("to-delegations-table")
    .locator("table tbody tr")
    .getByRole("button", { name: "Supprimer" })
    .click()
  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr")).toHaveCount(0)

  response = await page.request.post("http://localhost:3000/api/produits", {
    data: { ...product, internalReference: "REF-097" },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(400)
  expect(await response.text()).toEqual(
    '[{"code":"invalid_value","values":["DEPARTEMENT DE SEINE ET MARNE"],"path":["brand"],"message":"Invalid input: expected \\"DEPARTEMENT DE SEINE ET MARNE\\""}]',
  )

  await retry(async () => {
    response = await page.request.get("http://localhost:3000/api/organisation", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({
      name: "DEPARTEMENT DE SEINE ET MARNE",
      brands: [],
      authorizedBy: [],
      authorizeOrganization: [],
    })
  }, 3)

  await logout(page)
  await login(page, "ecopass-no-organization@yopmail.com")

  await page.getByRole("link", { name: "Mes produits" }).nth(0).click()
  await expect(page).toHaveURL(/.*\/produits/)

  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(0).locator("td").nth(2)).toHaveText(
    "REF-098",
  )
})
