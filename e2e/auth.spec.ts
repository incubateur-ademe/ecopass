import { test, expect } from "@playwright/test"
import { login, loginWithPassword } from "./utils/login"

test("connection with proconnect, and properly disconnect", async ({ page }) => {
  await login(page)

  await page.getByRole("link", { name: "Se déconnecter" }).first().click()

  await expect(page.locator("#contenu").getByRole("heading", { name: "Affichage environnemental" })).toBeVisible()

  await page.getByRole("link", { name: "Se connecter" }).first().click()
  await page.getByRole("button", { name: "S’identifier avec ProConnect" }).click()
  await expect(page.getByRole("textbox", { name: "Email professionnel Format" })).toBeVisible()
})

test("connection with proconnect and existing organization", async ({ page }) => {
  await page.goto("http://localhost:3000/")

  await login(page)

  await page.getByRole("link", { name: "Organisation" }).click()
  await expect(page.getByTestId("organization-name")).toHaveText("EMMAUS")
})

test("connection with proconnect and new organization", async ({ page }) => {
  await login(page, "ecopass-no-organization@yopmail.com")

  await page.goto("http://localhost:3000/organisation")
  await expect(page.getByTestId("other-organization")).toBeVisible
})

test("connection with account", async ({ page }) => {
  await loginWithPassword(page, "ecopass-password@yopmail.com")

  await page.goto("http://localhost:3000/organisation")
  await expect(page.getByTestId("organization-name")).toHaveText("EMMAUS")
})
