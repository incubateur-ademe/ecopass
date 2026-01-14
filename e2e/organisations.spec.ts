import { test, expect } from "@playwright/test"
import { exec } from "child_process"
import { promisify } from "util"
import { login, logout } from "./utils/login"
import { retry } from "./utils/retry"

const product = {
  gtins: ["1234567890128"],
  internalReference: "REF-099",
  brandId: "175570b3-59e4-40b4-89be-08a185685f78",
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

  await page.getByRole("link", { name: "Organisation" }).first().click()
  await expect(page).toHaveURL(/.*\/organisation/)

  await expect(page.getByTestId("brand-row-name")).toHaveCount(3)
  await expect(page.getByTestId("brand-row-name").nth(0)).toHaveText("Emmaus")
  await expect(page.getByTestId("brand-row-action").nth(0)).toHaveText("")
  await expect(page.getByTestId("brand-row-name").nth(1)).toHaveText("Emmaus Connect")
  await expect(page.getByTestId("brand-row-action").nth(1).getByRole("button")).toHaveText("Modifier")
  await expect(page.getByTestId("brand-row-name").nth(2)).toHaveText("Emmaus Solidarité")
  await expect(page.getByTestId("brand-row-action").nth(2).getByRole("button")).toHaveText("Modifier")

  await page.getByRole("textbox", { name: "Ajouter une marque" }).fill("Ma nouvelle marque")
  await page.getByRole("button", { name: "Ajouter" }).click()

  await expect(page.getByTestId("brand-row-name")).toHaveCount(4)
  await expect(page.getByTestId("brand-row-name").last()).toHaveText("Ma nouvelle marque")

  await page.getByTestId("brand-row-action").nth(1).getByRole("button").click()
  await expect(page.getByTestId("brand-row-name")).toHaveCount(4)
  await page.getByRole("radio").nth(1).click({ force: true })
  await page.getByRole("button", { name: "Enregistrer" }).click()
  await expect(page.getByTestId("brand-row-name").last()).toHaveText("Emmaus Connect")

  await page.getByTestId("brand-row-action").nth(1).getByRole("button").click()
  await expect(page.getByRole("textbox", { name: "Nom" }).nth(1)).toHaveValue("Emmaus Solidarité")
  await page.getByRole("textbox", { name: "Nom" }).nth(1).fill("Emmaus Solidarité Bis")
  await page.getByRole("button", { name: "Enregistrer" }).click()
  await expect(page.getByTestId("brand-row-name")).toHaveCount(4)
  await expect(page.getByTestId("brand-row-name").nth(1)).toHaveText("Emmaus Solidarité Bis")
})

test("manage delegation", async ({ page }) => {
  await login(page, "ecopass-consultancy@yopmail.com")

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

  await logout(page)
  await login(page)

  await page.getByRole("link", { name: "Organisation" }).first().click()
  await expect(page).toHaveURL(/.*\/organisation/)

  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr")).toHaveCount(0)
  await expect(page.getByTestId("from-delegations-table").locator("table tbody tr")).toHaveCount(0)

  await expect(page.getByTestId("organization-card")).not.toBeVisible()
  await page.getByRole("textbox", { name: "SIRET" }).fill("89964595600025")
  await expect(page.getByTestId("organization-card")).toBeVisible()
  await expect(page.getByTestId("organization-card")).toHaveText(
    "WARO3 RUE JOLIOT-CURIE, 91190 GIF-SUR-YVETTEDéléguer mes droits à cette organisation ",
  )
  await page
    .getByTestId("organization-card")
    .getByRole("button", { name: "Déléguer mes droits à cette organisation" })
    .click()
  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr").locator("td").nth(1)).toHaveText(
    "89964595600025",
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
      name: "WARO",
      displayName: "WARO",
      brands: [{ name: "WARO", id: expect.any(String), active: true, default: true }],
      authorizedBy: [
        {
          createdAt: expect.any(String),
          name: "EMMAUS",
          siret: "31723624800017",
          brands: [
            {
              id: "26ed7820-ebca-4235-b1d3-dbeab02b1768",
              name: "Emmaus Solidarité",
            },
            {
              id: "175570b3-59e4-40b4-89be-08a185685f78",
              name: "Emmaus Connect",
            },
            {
              id: "6abd8a2b-8fee-4c54-8d23-17e1f8c27b56",
              name: "Emmaus",
            },
          ],
        },
      ],
      authorizeOrganization: [],
    })
  }, 3)

  await logout(page)
  await login(page, "ecopass-consultancy@yopmail.com")

  await page.getByRole("link", { name: "Organisation" }).first().click()
  await expect(page).toHaveURL(/.*\/organisation/)

  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr")).toHaveCount(0)
  await expect(page.getByTestId("from-delegations-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page.getByTestId("from-delegations-table").locator("table tbody tr").locator("td").nth(1)).toHaveText(
    "31723624800017",
  )

  await logout(page)
  await login(page)

  await page.getByRole("link", { name: "Organisation" }).first().click()
  await expect(page).toHaveURL(/.*\/organisation/)

  await page
    .getByTestId("to-delegations-table")
    .locator("table tbody tr")
    .getByRole("button", { name: "Supprimer" })
    .click()
  await page.getByRole("button", { name: "Confirmer la suppression" }).click()
  await expect(page.getByTestId("to-delegations-table").locator("table tbody tr")).toHaveCount(0)

  response = await page.request.post("http://localhost:3000/api/produits", {
    data: { ...product, internalReference: "REF-097" },
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  expect(response.status()).toBe(400)

  await retry(async () => {
    response = await page.request.get("http://localhost:3000/api/organisation", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({
      name: "WARO",
      displayName: "WARO",
      brands: [{ name: "WARO", id: expect.any(String), active: true, default: true }],
      authorizedBy: [],
      authorizeOrganization: [],
    })
  }, 3)

  await page.getByRole("link", { name: "Produits déclarés" }).nth(0).click()
  await expect(page).toHaveURL(/.*\/produits/)

  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(0).locator("td").nth(0)).toHaveText(
    "REF-098",
  )

  await logout(page)
  await login(page, "ecopass-consultancy@yopmail.com")

  await page.getByRole("link", { name: "Produits déclarés" }).nth(0).click()
  await expect(page).toHaveURL(/.*\/produits/)

  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(1)
  await expect(page.getByTestId("products-table").locator("table tbody tr").nth(0).locator("td").nth(0)).toHaveText(
    "REF-098",
  )
})
