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
  await expect(page.locator(".fr-message--error").nth(2)).toHaveText("Le prix doit être supérieur ou égal à 1 €")
  await expect(page.locator(".fr-alert--error").nth(0)).toHaveText("La matière première est requise")

  await page.getByLabel("Matière 1", { exact: true }).selectOption("elasthane")
  await page.getByRole("spinbutton", { name: "Proportion (%)" }).fill("75")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await expect(page.locator(".fr-alert--error").nth(0)).toHaveText("La somme des proportions doit être égale à 100%")

  await page.getByRole("combobox", { name: "Catégorie de produit" }).click()
  await page.getByText("Caleçon", { exact: true }).click()
  await page.getByRole("spinbutton", { name: "Masse du produit fini (en" }).fill("109")
  await page.getByRole("spinbutton", { name: "Prix du produit" }).fill("15")
  await page.getByLabel("Lieu de tissage / tricotage").click()
  await page.getByLabel("Lieu de tissage / tricotage").selectOption("REE")
  await page.getByLabel("Lieu d'ennoblissement").click()
  await page.getByLabel("Lieu d'ennoblissement").selectOption("TR")
  await page.getByLabel("Lieu de confection").click()
  await page.getByLabel("Lieu de confection").selectOption("VN")
  await page.getByRole("button", { name: "Ajouter une matière" }).click()
  await page.getByLabel("Matière 2", { exact: true }).selectOption("ei-jute-kenaf")
  await page.getByRole("spinbutton", { name: "Proportion (%)" }).nth(1).fill("25")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await page.getByRole("link", { name: "Voir le produit" }).click()

  await expect(page.getByTestId("product-score")).toContainText(
    "Coût environnemental : 871 points d'impact, 799 pour 100g",
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

  await expect(response.score).toBe(870.5449134818682)
  await expect(response.standardized).toBe(798.6650582402461)
  await expect(response.meanScore).toBe(870.5449134818682)
  await expect(response.meanStandardized).toBe(798.6650582402461)
  await expect(response.confidenceLevel).toBe("Low")
  await expect(response.meanScores).toStrictEqual({
    acd: 0.0361370834155042,
    cch: 5.716673461641866,
    etf: 87.43368613459887,
    fru: 84.04406038634843,
    fwe: 0.0019004946108311103,
    ior: 9.251672503698895,
    ldu: 21.45263981536722,
    microfibers: 97.16776315789473,
    mru: 0.000019368767969496584,
    outOfEuropeEOL: 86.76973684210526,
    ozd: 1.6478686846418843e-7,
    pco: 0.02169001009366494,
    pma: 3.170714155101269e-7,
    swe: 0.008750285896582262,
    tre: 0.08750852539508294,
    wtu: 1.0404065128012912,
    materials: 241.23897013115052,
    spinning: 23.458431494863078,
    fabric: 39.89407211055,
    dyeing: 93.84621368602942,
    making: 18.208012500000002,
    usage: 102.6903160408,
    endOfLife: 69.57336559999999,
    transport: 72.16625868282694,
    trims: 0.538494,
    htc: 3.3146455329084597e-9,
    htn: 5.395417732533047e-9,
    durability: 0.76,
    score: 870.5449134818682,
    standardized: 798.6650582402461,
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
  await page.getByRole("spinbutton", { name: "Prix du produit" }).fill("55")
  await page.getByLabel("Lieu de tissage / tricotage").click()
  await page.getByLabel("Lieu de tissage / tricotage").selectOption("REE")
  await page.getByLabel("Lieu d'ennoblissement").click()
  await page.getByLabel("Lieu d'ennoblissement").selectOption("TR")
  await page.getByLabel("Lieu de confection").click()
  await page.getByLabel("Lieu de confection").selectOption("VN")
  await page.getByLabel("Matière 1", { exact: true }).selectOption("elasthane")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await page.getByRole("link", { name: "Voir le produit" }).click()

  await expect(page.getByTestId("product-score")).toContainText(
    "Coût environnemental : 1030 points d'impact, 697 pour 100g",
  )
  await expect(page.getByTestId("confidence-level-badge")).toContainText("Indice de confiance :FAIBLE?")

  response = await (await page.request.get("http://localhost:3000/api/produits/6234567891007")).json()

  await expect(response.score).toBe(1189.8725171319338)
  await expect(response.standardized).toBe(594.9362585659669)
  await expect(response.meanScore).toBe(1030.208715306901)
  await expect(response.meanStandardized).toBe(696.8006584031066)
  await expect(response.confidenceLevel).toBe("Low")
  await expect(response.meanScores).toStrictEqual({
    acd: 0.0405882814254724,
    cch: 6.835095502789818,
    etf: 109.74644644002926,
    fru: 99.58980537732536,
    fwe: 0.0015094046262644385,
    ior: 7.58577043025935,
    ldu: 22.239910783298825,
    microfibers: 136.75592458970004,
    mru: 0.000023242952545824307,
    outOfEuropeEOL: 108.43863186191284,
    ozd: 2.442523529983722e-7,
    pco: 0.026352633597011402,
    pma: 3.8790059073455856e-7,
    swe: 0.00929772736713189,
    tre: 0.09381384780597848,
    wtu: 1.4587760272047325,
    materials: 365.4922122018431,
    spinning: 25.748056524595498,
    fabric: 53.672385954599996,
    dyeing: 121.87244773225001,
    making: 18.208012500000002,
    usage: 96.2154019164,
    endOfLife: 98.6267716,
    transport: 102.51239365977065,
    trims: 1.7501055,
    htc: 4.572492901542395e-9,
    htn: 7.1518157992828155e-9,
    durability: 0.845,
    score: 1030.208715306901,
    standardized: 696.8006584031066,
  })
})
