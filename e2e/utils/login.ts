import { expect, Page } from "@playwright/test"

export const login = async (page: Page, email = "ecopass-e2e@yopmail.com", password = "ecopasscestsupercool") => {
  await page.goto("http://localhost:3000/login")
  await expect(page.locator("#contenu").getByRole("button", { name: "S’identifier avec ProConnect" })).toBeVisible()

  await page.getByRole("button", { name: "S’identifier avec ProConnect" }).click()

  try {
    await page.getByRole("textbox", { name: "Email professionnel Format" }).clear()
    await page.getByRole("textbox", { name: "Email professionnel Format" }).fill(email)
    await page.getByTestId("interaction-connection-button").click()

    await expect(page.locator("#main")).toContainText(`Votre email : ${email} Changer d’adresse email`)
  } catch {
    // If we logout and login too fast proconnect take the old email...
    // So we reload the page and try again
    page.reload()
    await page.getByRole("button", { name: "Changer d’adresse email" }).click()
    await page.getByRole("textbox", { name: "Email professionnel Format" }).clear()
    await page.getByRole("textbox", { name: "Email professionnel Format" }).fill(email)
    await page.getByTestId("interaction-connection-button").click()

    await expect(page.locator("#main")).toContainText(`Votre email : ${email} Changer d’adresse email`)
  }

  await page.getByRole("textbox", { name: "Renseignez votre mot de passe" }).fill(password)
  await page.getByRole("button", { name: "S’identifier" }).click()

  await expect(page.getByRole("link", { name: "Se déconnecter", exact: true }).first()).toBeVisible()
}

export const loginWithPassword = async (
  page: Page,
  email = "ecopass-e2e@yopmail.com",
  password = "ecopasscestsupercool",
) => {
  await page.goto("http://localhost:3000/login")
  await expect(page.locator("#contenu").getByRole("button", { name: "S’identifier avec ProConnect" })).toBeVisible()

  await page.getByRole("textbox", { name: "Email" }).fill(email)
  await page.getByRole("textbox", { name: "Mot de passe" }).fill(password)
  await page.getByRole("button", { name: "Se connecter" }).click()

  await expect(page.getByRole("link", { name: "Se déconnecter", exact: true }).first()).toBeVisible()
}

export const logout = async (page: Page) => {
  await page.getByRole("link", { name: "Se déconnecter" }).first().click()

  await expect(page.getByRole("link", { name: "Se connecter", exact: true })).toBeVisible()
  await expect(page.locator("#contenu").getByRole("heading", { name: "Affichage environnemental" })).toBeVisible()
}
