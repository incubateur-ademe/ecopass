import { test, expect } from "@playwright/test"

import { login } from "./utils/login"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

test.beforeEach(async () => {
  await execAsync("npx prisma db seed")
})

test("Connection with a brand user", async ({ page }) => {
  await login(page)

  await expect(page.getByRole("link", { name: "Produits déclarés", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Consulter vos produits", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarations", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarer vos produits", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "API" })).toHaveCount(2)

  await page.getByRole("link", { name: "Produits déclarés", exact: true }).click()
  await expect(page).toHaveURL(/.*\/produits/)
  await expect(page.getByRole("heading", { name: "Mes produits", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Déclarations", exact: true }).click()
  await expect(page).toHaveURL(/.*\/declarations/)
  await expect(page.getByRole("heading", { name: "Mes déclarations", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Organisation", exact: true }).click()
  await expect(page).toHaveURL(/.*\/organisation/)
  await expect(page.getByRole("heading", { name: "Mon organisation", exact: true })).toBeVisible()

  await expect(page.getByTestId("organization-type")).toHaveText("Marque")
  await expect(page.getByTestId("brand-organization")).toBeVisible
})

test("Connection with a consultancy user", async ({ page }) => {
  await login(page, "ecopass-consultancy@yopmail.com")

  await expect(page.getByRole("link", { name: "Produits déclarés", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Consulter vos produits", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarations", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarer vos produits", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "API" })).toHaveCount(2)

  await page.getByRole("link", { name: "Produits déclarés", exact: true }).click()
  await expect(page).toHaveURL(/.*\/produits/)
  await expect(page.getByRole("heading", { name: "Mes produits", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Déclarations", exact: true }).click()
  await expect(page).toHaveURL(/.*\/declarations/)
  await expect(page.getByRole("heading", { name: "Mes déclarations", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Organisation", exact: true }).click()
  await expect(page).toHaveURL(/.*\/organisation/)
  await expect(page.getByRole("heading", { name: "Mon organisation", exact: true })).toBeVisible()

  await expect(page.getByTestId("organization-type")).toHaveText("Bureau d'études")
  await expect(page.getByTestId("consultancy-organization")).toBeVisible
})

test("Connection with a distributor user", async ({ page }) => {
  await login(page, "ecopass-distributor@yopmail.com")

  await expect(page.getByRole("link", { name: "Produits déclarés", exact: true })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Consulter vos produits", exact: true })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarations", exact: true })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarer vos produits", exact: true })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "API" })).toHaveCount(1)

  await page.goto("http://localhost:3000/produits")
  await expect(page).toHaveURL(/.*\//)
  await expect(page.getByRole("heading", { name: "Mes produits", exact: true })).not.toBeVisible()

  await page.goto("http://localhost:3000/declarations")
  await expect(page).toHaveURL(/.*\//)
  await expect(page.getByRole("heading", { name: "Mes déclarations", exact: true })).not.toBeVisible()

  await page.getByRole("link", { name: "Organisation", exact: true }).click()
  await expect(page).toHaveURL(/.*\/organisation/)
  await expect(page.getByRole("heading", { name: "Mon organisation", exact: true })).toBeVisible()

  await expect(page.getByTestId("organization-type")).toHaveText("Distributeur")
  await expect(page.getByTestId("distributor-organization")).toBeVisible
})

test("Connection with a other user", async ({ page }) => {
  await login(page, "ecopass-no-organization@yopmail.com")

  await expect(page.getByRole("link", { name: "Produits déclarés", exact: true })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Consulter vos produits", exact: true })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarations", exact: true })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarer vos produits", exact: true })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "API" })).toHaveCount(1)

  await page.goto("http://localhost:3000/produits")
  await expect(page).toHaveURL(/.*\//)
  await expect(page.getByRole("heading", { name: "Mes produits", exact: true })).not.toBeVisible()

  await page.goto("http://localhost:3000/declarations")
  await expect(page).toHaveURL(/.*\//)
  await expect(page.getByRole("heading", { name: "Mes déclarations", exact: true })).not.toBeVisible()

  await page.getByRole("link", { name: "Organisation", exact: true }).click()
  await expect(page).toHaveURL(/.*\/organisation/)
  await expect(page.getByRole("heading", { name: "Mon organisation", exact: true })).not.toBeVisible()
  await expect(
    page.getByRole("heading", { name: "L’accès connecté au portail est actuellement restreint." }),
  ).toBeVisible()

  await expect(page.getByTestId("other-organization")).toBeVisible
})

test("Connection with an unknown user", async ({ page }) => {
  await login(page, "ecopass-unknown@yopmail.com")
  await expect(page).toHaveURL(/.*\/organisation\/type/)

  await page.goto("http://localhost:3000/produits")
  await expect(page).toHaveURL(/.*\/organisation\/type/)
  await expect(page.getByRole("heading", { name: "Mes produits", exact: true })).not.toBeVisible()

  await page.goto("http://localhost:3000/declarations")
  await expect(page).toHaveURL(/.*\/organisation\/type/)
  await expect(page.getByRole("heading", { name: "Mes déclarations", exact: true })).not.toBeVisible()

  await page.getByRole("radio").nth(2).click({ force: true })
  await page.getByRole("button", { name: "Valider" }).click()

  await expect(page).toHaveURL(/.*\//)

  await expect(page.getByRole("link", { name: "Produits déclarés", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Consulter vos produits", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarations", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "Déclarer vos produits", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "API" })).toHaveCount(2)

  await page.getByRole("link", { name: "Produits déclarés", exact: true }).click()
  await expect(page).toHaveURL(/.*\/produits/)
  await expect(page.getByRole("heading", { name: "Mes produits", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Déclarations", exact: true }).click()
  await expect(page).toHaveURL(/.*\/declarations/)
  await expect(page.getByRole("heading", { name: "Mes déclarations", exact: true })).toBeVisible()

  await page.getByRole("link", { name: "Organisation", exact: true }).click()
  await expect(page).toHaveURL(/.*\/organisation/)
  await expect(page.getByRole("heading", { name: "Mon organisation", exact: true })).toBeVisible()

  await expect(page.getByTestId("organization-type")).toHaveText("Marque et distributeur")
  await expect(page.getByTestId("brand-organization")).toBeVisible
})
