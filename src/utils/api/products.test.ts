import { handleProductPOST } from "./products"
import { OrganizationType } from "@prisma/enums"
import { getApiUser } from "../../services/auth/auth"
import { computeBatchInformations, computeEcobalyseScore } from "../ecobalyse/api"
import { createScore } from "../../db/score"
import { updateAPIUse } from "../../db/user"
import { getAuthorizedBrands } from "../organization/brands"
import { scoreIsValid } from "../validation/score"
import { checkOldProduct, ProductCheckResult } from "../../services/validation/oldProduct"
import { hashProduct } from "../encryption/hash"
import { getBrandById } from "../../db/brands"
import { getDefaultGTINs } from "../validation/gtin"

jest.mock("../../services/auth/auth", () => ({
  getApiUser: jest.fn(),
}))

jest.mock("../ecobalyse/api", () => ({
  computeBatchInformations: jest.fn(),
  computeEcobalyseScore: jest.fn(),
}))

jest.mock("../../db/score", () => ({
  createScore: jest.fn(),
}))

jest.mock("../../db/user", () => ({
  updateAPIUse: jest.fn(),
}))

jest.mock("../organization/brands", () => ({
  getAuthorizedBrands: jest.fn(),
}))

jest.mock("../validation/score", () => ({
  scoreIsValid: jest.fn(),
}))

jest.mock("../../services/validation/oldProduct", () => ({
  checkOldProduct: jest.fn(),
  ProductCheckResult: {
    Valid: 0,
    TooRecent: 1,
    Unchanged: 2,
  },
}))

jest.mock("../encryption/hash", () => ({
  hashProduct: jest.fn(),
}))

jest.mock("../../db/brands", () => ({
  getBrandById: jest.fn(),
}))

jest.mock("../validation/gtin", () => {
  const actual = jest.requireActual("../validation/gtin")
  return {
    ...actual,
    getDefaultGTINs: jest.fn(),
  }
})

describe("handleProductPOST", () => {
  const mockedGetApiUser = getApiUser as jest.MockedFunction<typeof getApiUser>
  const mockedComputeBatchInformations = computeBatchInformations as jest.MockedFunction<typeof computeBatchInformations>
  const mockedComputeEcobalyseScore = computeEcobalyseScore as jest.MockedFunction<typeof computeEcobalyseScore>
  const mockedCreateScore = createScore as jest.MockedFunction<typeof createScore>
  const mockedUpdateAPIUse = updateAPIUse as jest.MockedFunction<typeof updateAPIUse>
  const mockedGetAuthorizedBrands = getAuthorizedBrands as jest.MockedFunction<typeof getAuthorizedBrands>
  const mockedScoreIsValid = scoreIsValid as jest.MockedFunction<typeof scoreIsValid>
  const mockedCheckOldProduct = checkOldProduct as jest.MockedFunction<typeof checkOldProduct>
  const mockedHashProduct = hashProduct as jest.MockedFunction<typeof hashProduct>
  const mockedGetBrandById = getBrandById as jest.MockedFunction<typeof getBrandById>
  const mockedGetDefaultGTINs = getDefaultGTINs as jest.MockedFunction<typeof getDefaultGTINs>

  const makeRequest = (body: Record<string, unknown>) =>
    new Request("http://localhost/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })

  const validApi = {
    key: "api-key",
    user: {
      id: "user-1",
      email: "user-1@example.com",
      organization: {
        id: "org-1",
        name: "Org 1",
        type: OrganizationType.Brand,
        brands: [{ id: "brand-1", name: "Brand 1", active: true, default: true }],
        authorizedBy: [],
      },
    },
  }

  const validBrand = {
    id: "brand-1",
    name: "Brand 1",
    organization: {
      id: "org-1",
      siret: "12345678",
      uniqueId: null,
      name: "Org 1",
      displayName: "Org 1",
      noGTIN: true,
      authorizedOrganizations: [],
    },
  }

  const validSingleBody = {
    internalReference: "REF-1",
    product: "jean",
    mass: 1,
    materials: [{ id: "ei-coton", share: 1 }],
    countryMaking: "FR",
    countryDyeing: "FR",
    countryFabric: "FR",
  }

  const validBatchBody = {
    internalReference: "REF-BATCH",
    products: [
      {
        product: "jean",
        mass: 1,
        materials: [{ id: "ei-coton", share: 1 }],
        countryMaking: "FR",
        countryDyeing: "FR",
        countryFabric: "FR",
      },
      {
        product: "pull",
        mass: 1,
        materials: [{ id: "ei-coton", share: 1 }],
        countryMaking: "FR",
        countryDyeing: "FR",
        countryFabric: "FR",
      },
    ],
  }

  const validMultiBody = {
    internalReference: "REF-MULTI",
    product: "jean",
    components: [
      {
        mass: 1,
        materials: [{ id: "ei-coton", share: 1 }],
        countryMaking: "FR",
        countryDyeing: "FR",
        countryFabric: "FR",
        mainComponent: true,
      },
      {
        mass: 1,
        materials: [{ id: "ei-coton", share: 1 }],
        countryDyeing: "FR",
        countryFabric: "FR",
        mainComponent: false,
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedGetApiUser.mockResolvedValue(validApi)
    mockedGetAuthorizedBrands.mockReturnValue(["brand-1"])
    mockedGetBrandById.mockResolvedValue(validBrand)
    mockedGetDefaultGTINs.mockReturnValue(["0000000000000"])
    mockedHashProduct.mockReturnValue("hash-1")
    mockedCheckOldProduct.mockResolvedValue({ result: ProductCheckResult.Valid })
    mockedComputeBatchInformations.mockImplementation((_price, _numberOfReferences, products) => products as any)
    mockedComputeEcobalyseScore.mockResolvedValue({ score: 42 } as any)
    mockedScoreIsValid.mockReturnValue(true)
    mockedUpdateAPIUse.mockResolvedValue()
    mockedCreateScore.mockResolvedValue(undefined)
  })

  it("returns 401 when api user is missing", async () => {
    mockedGetApiUser.mockResolvedValue(null)

    const response = await handleProductPOST(makeRequest({}), "single")

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" })
  })

  it("returns 403 when organization type is not allowed", async () => {
    mockedGetApiUser.mockResolvedValue({
      ...validApi,
      user: {
        ...validApi.user,
        organization: {
          ...validApi.user.organization,
          type: OrganizationType.Distributor,
        },
      },
    })

    const response = await handleProductPOST(makeRequest({}), "single")

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({
      error:
        "Votre organisation n'est pas autorisée à déclarer des produits. Si vous pensez que c'est une erreur, veuillez contacter le support.",
      organizationType: "Distributeur",
    })
  })

  it("returns message when body uses legacy brand field", async () => {
    const response = await handleProductPOST(makeRequest({ brand: "old-brand" }), "single")

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(
      "Attention, le champ 'brand' a été remplacé par 'brandId'. Veuillez mettre à jour votre requête.",
    )
  })

  it("returns 400 when gtins are provided but organization does not use GTIN", async () => {
    const response = await handleProductPOST(makeRequest({ ...validSingleBody, gtins: ["1234567890128"] }), "single")

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Votre organisation n'utilise pas de GTIN, le champ 'gtins' ne doit pas être renseigné.",
    })
    expect(mockedComputeEcobalyseScore).not.toHaveBeenCalled()
  })

  it("returns 400 when gtins are invalid for organization using GTIN", async () => {
    mockedGetBrandById.mockResolvedValue({
      ...validBrand,
      organization: {
        ...validBrand.organization,
        noGTIN: false,
      },
    })

    const response = await handleProductPOST(makeRequest({ ...validSingleBody, gtins: ["123"] }), "single")

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.map((issue: { path: (string | number)[]; message: string }) => ({
      path: issue.path,
      message: issue.message,
    }))).toEqual([{ path: [0], message: "Le code GTIN doit contenir 8 ou 13 chiffres" }])
    expect(mockedComputeEcobalyseScore).not.toHaveBeenCalled()
  })

  it("uses provided gtins when organization uses GTIN", async () => {
    mockedGetBrandById.mockResolvedValue({
      ...validBrand,
      organization: {
        ...validBrand.organization,
        noGTIN: false,
      },
    })

    const response = await handleProductPOST(makeRequest({ ...validSingleBody, gtins: ["1234567890128"] }), "single")

    expect(response.status).toBe(201)
    expect(mockedGetDefaultGTINs).not.toHaveBeenCalled()
    expect(mockedCheckOldProduct).toHaveBeenCalledWith(["1234567890128"], "hash-1")
  })

  it("creates score and returns success on valid single product", async () => {
    const response = await handleProductPOST(makeRequest(validSingleBody), "single")

    expect(mockedUpdateAPIUse).toHaveBeenCalledWith("api-key")
    expect(mockedComputeEcobalyseScore).toHaveBeenCalledTimes(1)
    expect(mockedCreateScore).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toEqual({ result: "success" })
  })

  it("returns 400 when declared score does not match computed score", async () => {
    mockedComputeEcobalyseScore.mockResolvedValue({ score: 85.5 } as any)
    mockedScoreIsValid.mockReturnValue(false)

    const response = await handleProductPOST(makeRequest({ ...validSingleBody, declaredScore: 100 }), "single")

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual([
      {
        code: "invalid_value",
        path: ["declaredScore"],
        message: "Le score déclaré (100) ne correspond pas au score calculé (85.5)",
      },
    ])
    expect(mockedCreateScore).not.toHaveBeenCalled()
  })

  it("returns 400 when single body is invalid", async () => {
    const response = await handleProductPOST(
      makeRequest({ ...validSingleBody, countryMaking: undefined }),
      "single",
    )

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.map((issue: { path: (string | number)[]; message: string }) => ({
      path: issue.path,
      message: issue.message,
    }))).toEqual([
      {
        path: ["countryMaking"],
        message:
          'Invalid option: expected one of "REO"|"REE"|"RAS"|"RAF"|"RME"|"RLA"|"RNA"|"ROC"|"MM"|"BD"|"CN"|"FR"|"IN"|"KH"|"MA"|"PK"|"TN"|"TR"|"VN"',
      },
    ])
    expect(mockedComputeEcobalyseScore).not.toHaveBeenCalled()
  })

  it("uses main component countryMaking for other components in multicomponents", async () => {
    const response = await handleProductPOST(makeRequest(validMultiBody), "multicomponents")

    expect(response.status).toBe(201)
    expect(mockedComputeEcobalyseScore).toHaveBeenCalledTimes(2)
    expect(mockedComputeEcobalyseScore.mock.calls[0][0]).toEqual({
      mass: 1,
      materials: [{ id: "ei-coton", share: 1 }],
      countryMaking: "FR",
      countryDyeing: "FR",
      countryFabric: "FR",
      mainComponent: true,
      product: "jean",
      price: undefined,
      numberOfReferences: undefined,
      business: undefined,
      trims: undefined,
    })
    expect(mockedComputeEcobalyseScore.mock.calls[1][0]).toEqual({
      mass: 1,
      materials: [{ id: "ei-coton", share: 1 }],
      countryDyeing: "FR",
      countryFabric: "FR",
      mainComponent: false,
      countryMaking: "FR",
      product: "jean",
      price: undefined,
      numberOfReferences: undefined,
      business: undefined,
      trims: [],
    })
  })

  it("returns 400 when multicomponents body is invalid", async () => {
    const response = await handleProductPOST(
      makeRequest({
        ...validMultiBody,
        components: validMultiBody.components.map((component) => ({ ...component, mainComponent: false })),
      }),
      "multicomponents",
    )

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.map((issue: { path: (string | number)[]; message: string }) => ({
      path: issue.path,
      message: issue.message,
    }))).toEqual([{ path: ["components"], message: "Il doit y avoir exactement un composant principal." }])
  })

  it("creates score and returns success on valid batch product", async () => {
    const response = await handleProductPOST(makeRequest(validBatchBody), "batch")

    expect(response.status).toBe(201)
    expect(mockedComputeBatchInformations).toHaveBeenCalledTimes(1)
    expect(mockedComputeEcobalyseScore).toHaveBeenCalledTimes(2)
    expect(mockedCreateScore).toHaveBeenCalledTimes(1)
  })

  it("returns 400 when batch body is invalid", async () => {
    const response = await handleProductPOST(
      makeRequest({
        internalReference: "REF-BATCH",
        products: [
          {
            product: "jean",
            mass: 1,
            materials: [{ id: "ei-coton", share: 1 }],
            countryMaking: "FR",
            countryDyeing: "FR",
          },
        ],
      }),
      "batch",
    )

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.map((issue: { path: (string | number)[]; message: string }) => ({
      path: issue.path,
      message: issue.message,
    }))).toEqual([
      {
        path: ["products"],
        message: "countryDyeing et countryFabric sont requis pour chaque produit quand upcycled n'est pas true",
      },
    ])
    expect(mockedComputeEcobalyseScore).not.toHaveBeenCalled()
  })
})
