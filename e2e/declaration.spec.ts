import { test, expect } from "@playwright/test"
import { login } from "./utils/login"
import { exec } from "child_process"
import { promisify } from "util"
import { retry } from "./utils/retry"

const execAsync = promisify(exec)

test.beforeEach(async () => {
  await execAsync("npx prisma db seed")
})

test("declare my products", async ({ page }) => {
  await login(page)

  await page.getByRole("link", { name: "Mes déclarations" }).first().click()
  await expect(page).toHaveURL(/.*\/declaration/)

  await expect(page.getByTestId("uploads-table").locator("table tbody tr")).toHaveCount(0)
  await expect(page.locator("#contenu")).toContainText("Aucun fichier pour le moment.")

  await expect(page.getByTestId("upload-success")).not.toBeVisible()
  await expect(page.getByRole("button", { name: "Envoyer mon fichier pour validation" })).toBeDisabled()
  await page.locator("input[type='file']").setInputFiles("e2e/data/exemple.csv")
  await expect(page.getByRole("button", { name: "Envoyer mon fichier pour validation" })).not.toBeDisabled()
  await page.getByRole("button", { name: "Envoyer mon fichier pour validation" }).click()

  await expect(page.getByTestId("upload-success")).toBeVisible()

  await retry(
    async () => {
      await page.reload()

      await page.getByRole("heading", { name: "Mes fichiers" }).evaluate((el) => el.scrollIntoView({ block: "start" }))
      await expect(page.getByTestId("uploads-table").locator("table tbody tr")).toHaveCount(1)
      await expect(page.getByTestId("uploads-table").locator("table tbody tr").nth(0).locator("td").nth(1)).toHaveText(
        "exemple.csv",
      )
      await expect(page.getByTestId("uploads-table").locator("table tbody tr").nth(0).locator("td").nth(2)).toHaveText(
        "Déclaration validée",
      )
      await expect(page.getByTestId("uploads-table").locator("table tbody tr").nth(0).locator("td").nth(3)).toHaveText(
        "3/3",
      )
      await expect(
        page.getByTestId("uploads-table").locator("table tbody tr").nth(0).locator("td").nth(4).getByRole("button"),
      ).not.toBeDisabled()
    },
    3,
    async () => {
      await page.reload()
    },
  )

  const downloadPromise = page.waitForEvent("download")
  await page
    .getByTestId("uploads-table")
    .locator("table tbody tr")
    .nth(0)
    .locator("td")
    .nth(4)
    .getByRole("button")
    .click()
  const download = await downloadPromise
  const downloadPath = await download.path()
  const fs = await import("fs")
  const csvContent = fs.readFileSync(downloadPath!, "utf-8")

  expect(csvContent).toContain("Référence interne,Score,Erreur")
  expect(csvContent).toContain("REF-124,7565,")
  expect(csvContent).toContain("REF-125,1512,")
  expect(csvContent).toContain("REF-123,2456,")

  await page.getByRole("link", { name: "Mes produits" }).click()
  await expect(page).toHaveURL(/.*\/produits/)

  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(3)
  await expect(page.locator("#contenu")).toContainText("Vous avez déclaré des produits sur 2 marques différentes.")
  await expect(page.locator("#contenu")).toContainText("Vous avez 3 produits déclarés.")

  await page.getByLabel("Choisir une marque").selectOption({ value: "Emmaus Solidarité" })
  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(2)
  await expect(page.locator("#contenu")).toContainText("Vous avez déclaré des produits sur 2 marques différentes.")
  await expect(page.locator("#contenu")).toContainText(
    "Vous avez 2 produits déclarés pour la marque Emmaus Solidarité.",
  )
})
