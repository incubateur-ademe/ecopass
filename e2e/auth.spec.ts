import { test, expect } from "@playwright/test"

test("connection with proconnect", async ({ page }) => {
  await page.goto("http://localhost:3000/")
  await expect(page.locator("#contenu").getByRole("heading", { name: "Déclarez le coût" })).toBeVisible()
  await expect(page.locator("#contenu").getByRole("link", { name: "Se connecter" })).toBeVisible()

  await page.locator("#contenu").getByRole("link", { name: "Se connecter" }).click()
  await page.getByRole("button", { name: "S’identifier avec ProConnect" }).click()

  await page.getByRole("textbox", { name: "Email professionnel Format" }).click()
  await page.getByRole("textbox", { name: "Email professionnel Format" }).fill("ecopass-e2e@yopmail.com")
  await page.getByTestId("interaction-connection-button").click()
  await page.getByRole("button", { name: "Recevoir un lien d’" }).click()

  await page.goto("https://yopmail.com/")
  await page.getByRole("button", { name: "Consent" }).click()
  await page.getByRole("textbox", { name: "Login" }).fill("ecopass-e2e")
  await page.getByRole("button", { name: "" }).click()

  const page1Promise = page.waitForEvent("popup")
  await page.locator('iframe[name="ifmail"]').contentFrame().getByRole("link", { name: "Se connecter" }).click()
  const page1 = await page1Promise

  await expect(page1.locator("#contenu").getByRole("heading", { name: "Déclarez le coût" })).toBeVisible()
  await expect(page1.locator("#contenu").getByRole("link", { name: "Se connecter" })).not.toBeVisible()
})
