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
        "À corriger",
      )
      await expect(page.getByTestId("uploads-table").locator("table tbody tr").nth(0).locator("td").nth(3)).toHaveText(
        "3/13",
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

  expect(csvContent).toEqual(
    `Référence interne,Score,Erreur\n1234567891000,,"La part de transport aérien doit être un pourcentage, Délavage doit valoir 'Oui' ou 'Non', Origine confection invalide, Type d'impression invalide, Le pourcentage d'impression doit être un pourcentage, Type de matière invalide, La part de la matière doit être un pourcentage, Origine de la matière invalide, Type de matière invalide, La part de la matière doit être un pourcentage, Origine de la matière invalide, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre, Marque invalide. Voici la liste de vos marques : ""Emmaus"", ""Emmaus Solidarité"", ""Emmaus Connect"""\n1234567891002,,"Catégorie de produit invalide, Délavage doit valoir 'Oui' ou 'Non', Origine de l'ennoblissement/impression invalide, Origine de tissage/tricotage invalide, Type d'impression invalide, Le pourcentage d'impression doit être un pourcentage, La somme des parts de matières doit être égale à 100%, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre"\nREF-123,2456,\n1234567891001,,La somme des parts de matières doit être égale à 100%\nREF-124,7565,\n1234567891003,,"Le score doit être un nombre positif, La part de transport aérien doit être un pourcentage, Délavage doit valoir 'Oui' ou 'Non', Le poids est obligatoire, Le nombre de références doit être un nombre, Le prix doit être un nombre, Origine confection invalide, Type d'impression invalide, Le pourcentage d'impression doit être un pourcentage, Type de matière invalide, La part de la matière doit être un pourcentage, Origine de la matière invalide, Type de matière invalide, La part de la matière doit être un pourcentage, Origine de la matière invalide, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre"\n1234567891004,,"La part de transport aérien doit être un pourcentage, Remanufacturé doit valoir 'Oui' ou 'Non', Délavage doit valoir 'Oui' ou 'Non', Origine confection invalide, Type d'impression invalide, Le pourcentage d'impression doit être un pourcentage, Type de matière invalide, La part de la matière doit être un pourcentage, Origine de la matière invalide, Type de matière invalide, La part de la matière doit être un pourcentage, Origine de la matière invalide, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre"\n1234567891005,,"Date de mise sur le marché invalide (format attendu : JJ/MM/AA), La somme des parts de matières doit être égale à 100%"\n1234567891006,,La somme des parts de matières doit être égale à 100%\n1234567891007,,"La part de transport aérien doit être un pourcentage, Délavage doit valoir 'Oui' ou 'Non', Origine confection invalide, Type d'impression invalide, Le pourcentage d'impression doit être un pourcentage, Type de matière invalide, La part de la matière doit être un pourcentage, Origine de la matière invalide, Type de matière invalide, La part de la matière doit être un pourcentage, Origine de la matière invalide, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre"\nREF-125,1512,\n1234567891008,,"La masse doit être supérieure à 0,01 kg, Origine confection invalide, Le pourcentage d'impression doit être un pourcentage, La somme des parts de matières doit être égale à 100%, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre"\n1234567891009,,"Le nombre de références doit être inférieur à 999 999, Le prix doit être inférieur à 1000 €, Origine confection invalide, Le pourcentage d'impression doit être un pourcentage, La somme des parts de matières doit être égale à 100%, Type d'accessoire invalide, La quantité de l'accessoire doit être un nombre"\n`,
  )

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
