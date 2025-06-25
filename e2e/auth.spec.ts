import { test, expect } from "@playwright/test"

test("connection with proconnect, and properly disconnect", async ({ page }) => {
  await page.goto("http://localhost:3000/")
  await expect(page.locator("#contenu").getByRole("heading", { name: "Déclarez le coût" })).toBeVisible()
  await expect(page.locator("#contenu").getByRole("link", { name: "Se connecter" })).toBeVisible()

  await page.locator("#contenu").getByRole("link", { name: "Se connecter" }).click()
  await page.getByRole("button", { name: "S’identifier avec ProConnect" }).click()

  await page.getByRole("textbox", { name: "Email professionnel Format" }).fill("ecopass-e2e@yopmail.com")
  await page.getByTestId("interaction-connection-button").click()
  await page.getByRole("textbox", { name: "Renseignez votre mot de passe" }).fill("ecopasscestsupercool")
  await page.getByRole("button", { name: "S’identifier" }).click()

  await expect(page.locator("#contenu").getByRole("heading", { name: "Déclarez le coût" })).toBeVisible()
  await expect(page.locator("#contenu").getByRole("link", { name: "Se connecter" })).not.toBeVisible()

  await page.getByRole("link", { name: "Se déconnecter" }).click()

  await expect(page.locator("#contenu").getByRole("heading", { name: "Déclarez le coût" })).toBeVisible()
  await expect(page.locator("#contenu").getByRole("link", { name: "Se connecter" })).not.toBeVisible()

  await page.locator("#contenu").getByRole("link", { name: "Se connecter" }).click()
  await page.getByRole("button", { name: "S’identifier avec ProConnect" }).click()
  await expect(page.getByRole("textbox", { name: "Email professionnel Format" })).toBeVisible()
})
