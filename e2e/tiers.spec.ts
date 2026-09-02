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
  await expect(page.locator(".fr-alert--error").nth(0)).toHaveText("La matière première est requise")

  await page.getByLabel("Matière 1", { exact: true }).selectOption("elasthane")
  await page.getByRole("spinbutton", { name: "Proportion (%)" }).fill("75")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await expect(page.locator(".fr-alert--error").nth(0)).toHaveText("La somme des proportions doit être égale à 100%")

  await page.getByRole("combobox", { name: "Catégorie de produit" }).click()
  await page.getByText("Caleçon", { exact: true }).click()
  await page.getByRole("spinbutton", { name: "Masse du produit fini (en" }).fill("109")
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
  await page.getByLabel("Lieu de tissage / tricotage").click()
  await page.getByLabel("Lieu de tissage / tricotage").selectOption("REE")
  await page.getByLabel("Lieu d'ennoblissement").click()
  await page.getByLabel("Lieu d'ennoblissement").selectOption("TR")
  await page.getByLabel("Lieu de confection").click()
  await page.getByLabel("Lieu de confection").selectOption("VN")
  await page.getByLabel("Lieu de filature").click()
  await page.getByLabel("Lieu de filature").selectOption("FR")
  await page.getByLabel("Matière 1", { exact: true }).selectOption("elasthane")

  await page.getByRole("button", { name: "Valider ma déclaration" }).click()

  await page.getByRole("link", { name: "Voir le produit" }).click()

  await expect(page.getByTestId("product-score")).toContainText(
    "Coût environnemental : 1216 points d'impact, 810 pour 100g",
  )
  await expect(page.getByTestId("confidence-level-badge")).toContainText("Indice de confiance :FAIBLE?")

  response = await (await page.request.get("http://localhost:3000/api/produits/6234567891007")).json()

  await expect(response.score).toBe(1464.7882591780703)
  await expect(response.standardized).toBe(732.3941295890352)
  await expect(response.meanScore).toBe(1216.1402080945722)
  await expect(response.meanStandardized).toBe(810.0008065427168)
  await expect(response.confidenceLevel).toBe("Low")
  await expect(response.meanScores).toStrictEqual({
    acd: 0.047786390980898416,
    cch: 7.959221427047073,
    durability: 0.7,
    dyeing: 121.87244773225001,
    endOfLife: 98.6267716,
    etf: 132.9384911622633,
    fabric: 53.672385954599996,
    fru: 115.89031370696244,
    fwe: 0.0017446900224505242,
    htc: 5.562870970591703e-9,
    htn: 8.592714674051767e-9,
    ior: 7.5975740338465805,
    ldu: 25.08698365442983,
    making: 18.208012500000002,
    materials: 365.4922122018431,
    microfibers: 167.43884175015336,
    mru: 0.000026589732719037448,
    outOfEuropeEOL: 132.0893988959313,
    ozd: 2.8999641108248765e-7,
    pco: 0.03143147008164783,
    pma: 4.6600903703295464e-7,
    score: 1216.1402080945722,
    spinning: 14.18738586588958,
    standardized: 810.0008065427168,
    swe: 0.01102656073043139,
    transport: 104.87642558812294,
    tre: 0.11108334594139577,
    trims: 1.7501055,
    usage: 80.071840256,
    wtu: 1.7727987925391901,
  })
})
