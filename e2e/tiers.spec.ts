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
  await expect(page.locator(".fr-message--error").nth(1)).toHaveText(
    "Vous devez accepter les CGU pour valider votre déclaration",
  )
  await expect(page.locator(".fr-alert--error").nth(0)).toHaveText("La matière première est requise")

  await page.getByRole("combobox", { name: "Matière 1" }).click()
  await page.getByText("Elasthane (Lycra)", { exact: true }).click()
  await page.getByRole("spinbutton", { name: "Proportion (%)" }).fill("75")

  await page.locator("label").filter({ hasText: "En validant ma déclaration, j" }).click()

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await expect(page.locator(".fr-alert--error").nth(0)).toHaveText("La somme des proportions doit être égale à 100%")

  await page.getByRole("combobox", { name: "Catégorie de produit" }).click()
  await page.getByText("Caleçon", { exact: true }).click()
  await page.getByRole("spinbutton", { name: "Prix du produit" }).fill("15")
  await page.getByRole("combobox", { name: "Lieu de tissage / tricotage" }).click()
  await page.getByText("Région - Europe de l'Est", { exact: true }).click()
  await page.getByRole("combobox", { name: "Lieu d'ennoblissement" }).click()
  await page.getByText("Turquie", { exact: true }).click()
  await page.getByRole("combobox", { name: "Lieu de confection" }).click()
  await page.getByText("Vietnam", { exact: true }).click()
  await page.getByRole("button", { name: "Ajouter une matière" }).click()
  await page.getByRole("combobox", { name: "Matière 2" }).click()
  await page.getByText("Jute", { exact: true }).click()
  await page.getByRole("spinbutton", { name: "Proportion (%)" }).nth(1).fill("25")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await page.getByRole("link", { name: "Voir ce produit" }).click()

  await expect(page.getByTestId("product-score")).toContainText(
    "Coût environnemental : 1605 points d'impact, 791 pour 100g",
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

  await expect(response.score).toBe(1604.761094970975)
  await expect(response.standardized).toBe(790.5227068822537)
  await expect(response.meanScore).toBe(1604.761094970975)
  await expect(response.meanStandardized).toBe(790.5227068822537)
  await expect(response.confidenceLevel).toBe("Low")
  await expect(response.meanScores).toStrictEqual({
    acd: 0.06448635576669458,
    cch: 10.345767019077131,
    etf: 162.84516055421506,
    fru: 153.33439407528604,
    fwe: 0.0035434758959010902,
    ior: 17.231311266241917,
    ldu: 39.563352253192264,
    microfibers: 180.96381578947367,
    mru: 0.000035856212181523,
    outOfEuropeEOL: 161.59868421052633,
    ozd: 2.713343746378104e-7,
    pco: 0.03925235636473845,
    pma: 5.889003995403203e-7,
    swe: 0.015965054194432678,
    tre: 0.15921115901049931,
    wtu: 1.943451130969505,
    materials: 450.99693852865653,
    spinning: 43.943221972864265,
    fabric: 74.7708310566,
    dyeing: 175.86512574485295,
    making: 18.208012500000002,
    usage: 191.24893721360002,
    endOfLife: 129.55566800000003,
    transport: 134.49120316136705,
    trims: 0.538494,
    htc: 6.172515582258055e-9,
    htn: 9.960747161018389e-9,
    durability: 0.76,
    score: 1604.761094970975,
    standardized: 790.5227068822537,
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
  await page.getByRole("radio", { name: "Femme" }).click({ force: true })
  await page.getByRole("spinbutton", { name: "Prix du produit" }).fill("55")
  await page.getByRole("combobox", { name: "Lieu de tissage / tricotage" }).click()
  await page.getByText("Région - Europe de l'Est", { exact: true }).click()
  await page.getByRole("combobox", { name: "Lieu d'ennoblissement" }).click()
  await page.getByText("Turquie", { exact: true }).click()
  await page.getByRole("combobox", { name: "Lieu de confection" }).click()
  await page.getByText("Vietnam", { exact: true }).click()
  await page.getByRole("combobox", { name: "Matière 1" }).click()
  await page.getByText("Elasthane (Lycra)", { exact: true }).click()
  await page.locator("label").filter({ hasText: "En validant ma déclaration, j" }).click()

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await page.getByRole("link", { name: "Voir ce produit" }).click()

  await expect(page.getByTestId("product-score")).toContainText(
    "Coût environnemental : 1362 points d'impact, 693 pour 100g",
  )
  await expect(page.getByTestId("confidence-level-badge")).toContainText("Indice de confiance :FAIBLE?")

  response = await (await page.request.get("http://localhost:3000/api/produits/6234567891007")).json()

  await expect(response.score).toBe(1119.5054067289818)
  await expect(response.standardized).toBe(595.4815993239265)
  await expect(response.meanScore).toBe(1362.1332508499784)
  await expect(response.meanStandardized).toBe(693.0021531030901)
  await expect(response.confidenceLevel).toBe("Low")
  await expect(response.meanScores).toStrictEqual({
    acd: 0.05348415891809148,
    cch: 8.918162894011534,
    etf: 143.41337917989986,
    fru: 131.03925605184332,
    fwe: 0.0022967012397251936,
    ior: 11.401078619638511,
    ldu: 30.62020772027863,
    microfibers: 173.36362832484434,
    mru: 0.00003078501620887079,
    outOfEuropeEOL: 141.94987973967176,
    ozd: 2.932304822543942e-7,
    pco: 0.03423172263881552,
    pma: 5.098593735125762e-7,
    swe: 0.01261758774345615,
    tre: 0.1267550739348203,
    wtu: 1.852907154502577,
    materials: 455.33477807242,
    spinning: 35.118758551766255,
    fabric: 69.00735337020001,
    dyeing: 158.21022242636764,
    making: 18.208012500000002,
    usage: 138.28881024104,
    endOfLife: 124.78926520000002,
    transport: 129.6719243561531,
    trims: 1.7501055,
    htc: 5.823881099922897e-9,
    htn: 9.176719888192154e-9,
    durability: 0.845,
    score: 1362.1332508499784,
    standardized: 693.0021531030901,
  })
})
