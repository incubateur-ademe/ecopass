import { test, expect } from "@playwright/test"
import { login, loginWithPassword, logout } from "./utils/login"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

test.beforeEach(async () => {
  await execAsync("npx prisma db seed")
})

test("admin can create a new user", async ({ page }) => {
  await login(page, "ecopass-admin-dev@yopmail.com")

  await page.goto("http://localhost:3000/admin/nouvel-utilisateur")

  await expect(page).toHaveURL(/.*\/admin\/nouvel-utilisateur/)
  await expect(page.getByRole("heading", { name: "Créer un nouvel utilisateur" })).toBeVisible()

  const newUserEmail = "test-user@yopmail.com"
  const organizationName = "Test Org"

  await page.getByLabel("Adresse email").fill(newUserEmail)
  await page.getByLabel("Nom de l'organisation").fill(organizationName)
  await page.getByLabel("Type d'organisation").selectOption("Brand")

  await page.getByRole("button", { name: "Créer l'utilisateur" }).click()

  await expect(page.locator("text=Utilisateur créé avec succès et email de bienvenue envoyé")).toBeVisible()

  await logout(page)

  const emailResponse = await page.request.get("http://localhost:1080/email")
  expect(emailResponse.ok()).toBeTruthy()

  const emails = await emailResponse.json()
  const welcomeEmail = emails[emails.length - 1]
  expect(welcomeEmail).toBeDefined()

  if (!welcomeEmail) {
    throw new Error(`No email found for ${newUserEmail}`)
  }

  const emailTextResponse = await page.request.get(`http://localhost:1080/email/${welcomeEmail.id}`)
  expect(emailTextResponse.ok()).toBeTruthy()

  const emailContent = await emailTextResponse.json()
  const emailText = emailContent.text

  const resetLinkMatch = emailText.match(/reset-password\/([^\s\n]+)/)
  expect(resetLinkMatch).toBeDefined()
  if (!resetLinkMatch) {
    throw new Error("Reset link not found in email")
  }

  const token = resetLinkMatch[1]
  await page.goto(`http://localhost:3000/reset-password/${token}`)

  await expect(page.getByRole("heading", { name: "Nouveau mot de passe" })).toBeVisible()

  const newPassword = "NewSecurePassword123!"
  await page.getByLabel("Le mot de passe").fill(newPassword)
  await page.getByLabel("Confirmation").fill(newPassword)

  await page.getByRole("button", { name: "Changer le mot de passe" }).click()

  await expect(page).toHaveURL(/.*\/login/)

  await loginWithPassword(page, newUserEmail, newPassword)

  await page.getByRole("link", { name: "Organisation" }).click()
  await expect(page.getByTestId("organization-name")).toHaveText(organizationName)
})

test("admin can change organization info", async ({ page }) => {
  await login(page, "ecopass-admin-dev@yopmail.com")
  await page.goto("http://localhost:3000/organisations/676fc42f-97a8-427d-a133-536b6592bd67")

  await expect(page.getByTestId("organization-type")).toContainText("Type : Marque")
  await expect(page.getByTestId("organization-no-gtin")).toBeVisible()

  await expect(page.getByLabel("Organisation sans GTIN")).toBeVisible()
  await page.getByLabel("Type de l'organisation").selectOption("Distributor")
  await expect(page.getByLabel("Organisation sans GTIN")).not.toBeVisible()
  await page.getByRole("button", { name: "Valider" }).click()

  await page.reload()

  await expect(page.getByTestId("organization-type")).toContainText("Type : Distributeur")
  await expect(page.getByTestId("organization-no-gtin")).not.toBeVisible()
  await expect(page.getByLabel("Organisation sans GTIN")).not.toBeVisible()
  await page.getByLabel("Type de l'organisation").selectOption("Brand")
  await expect(page.getByLabel("Organisation sans GTIN")).toBeVisible()
  await page.getByText("Organisation sans GTIN").click()
  await page.getByRole("button", { name: "Valider" }).click()

  await expect(page.getByTestId("organization-type")).toContainText("Type : Marque")
  await expect(page.getByTestId("organization-no-gtin")).toBeVisible()

  await page.reload()

  await expect(page.getByTestId("organization-type")).toContainText("Type : Marque")
  await expect(page.getByTestId("organization-no-gtin")).toBeVisible()
})

test("default user cannot access admin pages", async ({ page }) => {
  await page.goto("http://localhost:3000/admin/nouvel-utilisateur")
  await expect(page).toHaveURL("http://localhost:3000/")

  await page.goto("http://localhost:3000/admin/donnees")
  await expect(page).toHaveURL("http://localhost:3000/")

  await page.goto("http://localhost:3000/admin/stats")
  await expect(page).toHaveURL("http://localhost:3000/")

  await login(page)

  await page.goto("http://localhost:3000/admin/nouvel-utilisateur")
  await expect(page).toHaveURL("http://localhost:3000/")

  await page.goto("http://localhost:3000/admin/donnees")
  await expect(page).toHaveURL("http://localhost:3000/")

  await page.goto("http://localhost:3000/admin/stats")
  await expect(page).toHaveURL("http://localhost:3000/")
})
