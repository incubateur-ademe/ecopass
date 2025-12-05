import { test, expect } from "@playwright/test"
import { login } from "./utils/login"

test("connection with proconnect, and properly disconnect", async ({ page }) => {
  await login(page)

  await page.getByRole("link", { name: "Se déconnecter" }).click()

  await expect(page.locator("#contenu").getByRole("heading", { name: "Déclarez le coût" })).toBeVisible()
  await expect(page.locator("#contenu").getByRole("button", { name: "S’identifier avec ProConnect" })).toBeVisible()

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
