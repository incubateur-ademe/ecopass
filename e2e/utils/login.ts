import { expect, Page } from "@playwright/test"

export const login = async (page: Page, email = "ecopass-e2e@yopmail.com", password = "ecopasscestsupercool") => {
  await page.goto("http://localhost:3000/")
  await expect(page.locator("#contenu").getByRole("heading", { name: "Déclarez le coût" })).toBeVisible()
  await expect(page.locator("#contenu").getByRole("button", { name: "S’identifier avec ProConnect" })).toBeVisible()

  await page.getByRole("button", { name: "S’identifier avec ProConnect" }).click()

  await page.getByRole("textbox", { name: "Email professionnel Format" }).fill(email)
  await page.getByTestId("interaction-connection-button").click()
  await page.getByRole("textbox", { name: "Renseignez votre mot de passe" }).fill(password)
  await page.getByRole("button", { name: "S’identifier" }).click()

  await expect(page.locator("#contenu").getByRole("heading", { name: "Déclarez le coût" })).toBeVisible()
  await expect(page.locator("#contenu").getByRole("button", { name: "S’identifier avec ProConnect" })).not.toBeVisible()
}
