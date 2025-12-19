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

  await page.getByRole("link", { name: "Déclarations" }).first().click()
  await expect(page).toHaveURL(/.*\/declaration/)

  await expect(page.getByTestId("uploads-table").locator("table tbody tr")).toHaveCount(0)
  await expect(page.locator("#contenu")).toContainText("Aucun fichier n’a été déposé pour le moment.")

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
        "6/17",
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
    `Référence interne,Score,Erreur\n2234567891001,,"Marque invalide. Voici la liste de vos marques : ""26ed7820-ebca-4235-b1d3-dbeab02b1768"", ""175570b3-59e4-40b4-89be-08a185685f78"", ""6abd8a2b-8fee-4c54-8d23-17e1f8c27b56"""\n2234567891001,,"Catégorie de produit invalide, Origine de l'ennoblissement/impression invalide, Origine de tissage/tricotage invalide, Origine de confection invalide, Origine de filature invalide, Type d'impression invalide, Type de matière invalide, Type de matière invalide"\nREF-123,2318,\n3234567891000,,Origine de confection invalide\nREF-124,6739,\n4234567891009,,"Le score doit être un nombre positif, La part de transport aérien doit être un pourcentage, Le poids est obligatoire, Le nombre de références doit être un nombre, Le prix doit être un nombre, Le pourcentage d'impression doit valoir 1%, 5%, 20%, 50% ou 80%, La part de la matière doit être un pourcentage, La part de la matière doit être un pourcentage, La quantité de l'accessoire doit être un nombre"\n5234567891008,,"Remanufacturé doit valoir 'Oui' ou 'Non', Délavage doit valoir 'Oui' ou 'Non'"\n7234567891006,,"Origine de confection invalide, La somme des parts de matières doit être égale à 100%"\n6234567891007,,Origine de confection invalide\n8234567891005,,Le score déclaré (2221) ne correspond pas au score calculé (2318.326247789541)\nREF-125,1290,\n9234567891004,,"La masse doit être supérieure à 0,01 kg, Origine de confection invalide"\n1134567891005,,"La part de transport aérien doit être inférieure à 100%, Le nombre de références doit être inférieur à 999 999, Origine de confection invalide, Le pourcentage d'impression doit valoir 1%, 5%, 20%, 50% ou 80%, La part de la matière doit être inférieure à 100%, La somme des parts de matières doit être égale à 100%"\nREF-126,2793,\n3134567891003,,L'origine de l'ennoblissement/impression et l'origine de tissage/tricotage sont requis quand le produit n'est pas remanufacturé\nREF-127,2762,\nREF-128,2760,\n`,
  )

  await page.getByRole("link", { name: "Produits déclarés" }).click()
  await expect(page).toHaveURL(/.*\/produits/)

  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(6)
  await expect(page.locator("#contenu")).toContainText("Vous avez déclaré des produits sur 2 marques différentes.")
  await expect(page.locator("#contenu")).toContainText("Vous avez 6 produits déclarés.")

  await page.getByLabel("Choisir une marque").selectOption({ value: "26ed7820-ebca-4235-b1d3-dbeab02b1768" })
  await expect(page.getByTestId("products-table").locator("table tbody tr")).toHaveCount(2)
  await expect(page.locator("#contenu")).toContainText("Vous avez déclaré des produits sur 2 marques différentes.")
  await expect(page.locator("#contenu")).toContainText(
    "Vous avez 2 produits déclarés pour la marque Emmaus Solidarité.",
  )
})
