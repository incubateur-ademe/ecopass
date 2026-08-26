import { test, expect } from "@playwright/test"
import { loginWithFranceConnectCredentials, logout } from "./utils/login"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

test.beforeEach(async () => {
  await execAsync("npx prisma db seed")
})

test("simplified declaration", async ({ page }) => {
  await loginWithFranceConnectCredentials(page)

  await page.getByRole("link", { name: "Déclarer des produits un par" }).click()

  await page.getByRole("button", { name: "Étape suivante" }).click()

  await expect(page.locator(".fr-message--error").nth(0)).toHaveText("Le nom de la marque est requis")
  await expect(page.locator(".fr-message--error").nth(1)).toHaveText("Le code barre (GTIN) est requis")

  await page.getByRole("combobox", { name: "Nom de la marque *" }).click()
  await page.getByRole("option", { name: "Emmaus Solidarité" }).click()
  await page.getByRole("textbox", { name: "Code barre (GTIN) *" }).fill("6234567891007")
  await page.getByRole("textbox", { name: "Référence interne (code ou dé" }).fill("Test")
  await page.getByRole("textbox", { name: "Référence interne (code ou dé" }).fill("Test")
  await page.getByRole("button", { name: "Étape suivante" }).click()

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await expect(page.locator(".fr-message--error").nth(0)).toHaveText("La catégorie de produit est requise")
  await expect(page.locator(".fr-message--error").nth(1)).toHaveText("La masse doit être un nombre positif")
  await expect(page.locator(".fr-error-text").nth(0)).toHaveText("Le lieu de tissage / tricotage est requis")
  await expect(page.locator(".fr-error-text").nth(1)).toHaveText("Le lieu d'ennoblissement est requis")
  await expect(page.locator(".fr-error-text").nth(2)).toHaveText("Le lieu de confection est requis")
  await expect(page.locator(".fr-alert--error").nth(0)).toHaveText("La matière première est requise")

  await page.getByLabel("Matière").selectOption("elasthane")
  await page.getByRole("spinbutton", { name: "Proportion 1 (%)" }).fill("75")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await expect(page.locator(".fr-alert--error").nth(0)).toHaveText("La somme des proportions doit être égale à 100%")

  await page.getByRole("combobox", { name: "Catégorie de produit" }).click()
  await page.getByText("Caleçon", { exact: true }).click()
  await page.getByRole("spinbutton", { name: "Masse du produit fini (en" }).fill("109")
  await page.getByLabel("Lieu de tissage / tricotage *").click()
  await page.getByLabel("Lieu de tissage / tricotage *").selectOption("REE")
  await page.getByLabel("Lieu d'ennoblissement *").click()
  await page.getByLabel("Lieu d'ennoblissement *").selectOption("TR")
  await page.getByLabel("Lieu de confection *").click()
  await page.getByLabel("Lieu de confection *").selectOption("VN")
  await page.getByRole("button", { name: "Ajouter une matière" }).click()
  await page.getByLabel("Matière 2").selectOption("ei-jute-kenaf")
  await page.getByRole("spinbutton", { name: "Proportion 2 (%)" }).fill("25")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await page.getByRole("link", { name: "Voir le produit" }).click()

  await expect(page.getByTestId("product-score")).toContainText(
    "Coût environnemental : 967 points d'impact, 888 pour 100g",
  )
  await expect(page.getByTestId("confidence-level-badge")).toContainText("Indice de confiance :FAIBLE?")

  await page.getByRole("link", { name: "Déclaration simplifiée" }).click()

  await page.getByRole("combobox", { name: "Nom de la marque *" }).click()
  await page.getByRole("option", { name: "Emmaus Solidarité" }).click()

  await page.getByRole("textbox", { name: "Code barre (GTIN) *" }).fill("0000000000000")

  await page.getByRole("button", { name: "Étape suivante" }).click()
  await expect(page.locator(".fr-message--error").nth(0)).toHaveText(
    "Ce produit a déjà été déclaré par sa marque. Voir le produit",
  )

  await page.getByRole("textbox", { name: "Code barre (GTIN) *" }).fill("6234567891007")

  await page.getByRole("button", { name: "Étape suivante" }).click()
  await expect(page.locator(".fr-message--error").nth(0)).toHaveText(
    "Vous avez déjà déclaré ce produit récemment. Voir le produit",
  )

  let response = await (await page.request.get("http://localhost:3000/api/produits/6234567891007")).json()

  await expect(response.score).toBe(967.4921570110743)
  await expect(response.standardized).toBe(887.6074834963983)
  await expect(response.meanScore).toBe(967.4921570110743)
  await expect(response.meanStandardized).toBe(887.6074834963983)
  await expect(response.confidenceLevel).toBe("Low")
  await expect(response.meanScores).toStrictEqual({
    acd: 0.04072898462596894,
    cch: 6.426923756939877,
    etf: 98.939746388142,
    fru: 92.51640894563404,
    fwe: 0.002144172261902155,
    ior: 9.14484789141367,
    ldu: 23.133849871349387,
    microfibers: 110.22014925373134,
    mru: 0.000020699802908384184,
    outOfEuropeEOL: 98.42537313432834,
    ozd: 1.7768178199240772e-7,
    pco: 0.02445631093196023,
    pma: 3.568070787280394e-7,
    swe: 0.00988135332113137,
    tre: 0.09888636406962394,
    wtu: 1.1735274781578824,
    materials: 241.23897013115052,
    spinning: 23.458431494863078,
    fabric: 39.89407211055,
    dyeing: 93.84621368602942,
    making: 18.208012500000002,
    usage: 89.295926992,
    endOfLife: 69.57336559999999,
    transport: 72.16625868282694,
    trims: 0.538494,
    htc: 3.738377892411985e-9,
    htn: 6.008223885689724e-9,
    durability: 0.67,
    score: 967.4921570110743,
    standardized: 887.6074834963983,
  })

  await logout(page)
  await loginWithFranceConnectCredentials(page, "ecopass-citoyen-2@yopmail.com")

  await page.getByRole("link", { name: "Déclarer des produits un par" }).click()
  await page.getByRole("combobox", { name: "Nom de la marque *" }).fill("New brand")
  await page.getByRole("option", { name: "New brand" }).click()
  await page.getByRole("textbox", { name: "Code barre (GTIN) *" }).fill("6234567891007")
  await page.getByRole("textbox", { name: "Référence interne (code ou dé" }).fill("Test")
  await page.getByRole("textbox", { name: "Référence interne (code ou dé" }).fill("Test")
  await page.getByRole("button", { name: "Étape suivante" }).click()
  await page.getByRole("combobox", { name: "Catégorie de produit" }).click()
  await page.getByText("Chemise", { exact: true }).click()
  await page.getByRole("spinbutton", { name: "Masse du produit fini (en" }).fill("200")
  await page.getByLabel("Lieu de tissage / tricotage *").click()
  await page.getByLabel("Lieu de tissage / tricotage *").selectOption("REE")
  await page.getByLabel("Lieu d'ennoblissement *").click()
  await page.getByLabel("Lieu d'ennoblissement *").selectOption("TR")
  await page.getByLabel("Lieu de confection *").click()
  await page.getByLabel("Lieu de confection *").selectOption("VN")
  await page.getByLabel("Matière").selectOption("elasthane")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await page.getByRole("link", { name: "Voir le produit" }).click()

  await expect(page.getByTestId("product-score")).toContainText(
    "Coût environnemental : 1229 points d'impact, 816 pour 100g",
  )
  await expect(page.getByTestId("confidence-level-badge")).toContainText("Indice de confiance :FAIBLE?")

  response = await (await page.request.get("http://localhost:3000/api/produits/6234567891007")).json()

  await expect(response.score).toBe(1489.9845296721896)
  await expect(response.standardized).toBe(744.9922648360948)
  await expect(response.meanScore).toBe(1228.738343341632)
  await expect(response.meanStandardized).toBe(816.2998741662466)
  await expect(response.confidenceLevel).toBe("Low")
  await expect(response.meanScores).toStrictEqual({
    acd: 0.048850600115267415,
    cch: 8.2393268503408,
    etf: 133.37716404864463,
    fru: 117.31982442979498,
    fwe: 0.0017776580120544496,
    ior: 7.574857077909407,
    ldu: 25.50636905803381,
    microfibers: 167.43884175015336,
    mru: 0.00002653200788953551,
    outOfEuropeEOL: 132.0893988959313,
    ozd: 2.8952517780383654e-7,
    pco: 0.031871499557066515,
    pma: 4.6868559655908426e-7,
    swe: 0.011178876545015783,
    tre: 0.1129171225093048,
    wtu: 1.7765712559882578,
    materials: 365.4922122018431,
    spinning: 25.748056524595498,
    fabric: 53.672385954599996,
    dyeing: 121.87244773225001,
    making: 18.208012500000002,
    usage: 80.071840256,
    endOfLife: 98.6267716,
    transport: 102.51239365977065,
    trims: 1.7501055,
    htc: 5.563873925654387e-9,
    htn: 8.578831190349637e-9,
    durability: 0.7,
    score: 1228.738343341632,
    standardized: 816.2998741662466,
  })
})
