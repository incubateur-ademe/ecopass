import { checkOldProduct, ProductCheckResult } from "./oldProduct"
import * as productDb from "../../db/product"
import { ConfidenceLevel, UserType } from "@prisma/enums"

describe("checkOldProduct", () => {
  const gtins = ["1234567890123"]
  const hash = "testhash"

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should return Unchanged if a product with the same hash exists", async () => {
    jest.spyOn(productDb, "getLastProductsByGtins").mockResolvedValue([
      {
        hash,
        createdAt: new Date(),
        gtins,
        id: "1",
        confidenceLevel: ConfidenceLevel.High,
        upload: {
          createdBy: { id: "user-1", type: UserType.CITOYEN, organizationId: null },
          organizationId: null,
        },
      },
    ])

    const result = await checkOldProduct(gtins, hash, ConfidenceLevel.High, {
      userId: "user-1",
      userType: UserType.CITOYEN,
      organizationId: null,
    })
    expect(result.result).toBe(ProductCheckResult.Unchanged)
    expect(result.lastProduct?.hash).toBe(hash)
  })

  it("should block a High confidence level product when a declaration is too recent", async () => {
    jest.spyOn(productDb, "getLastProductsByGtins").mockResolvedValue([
      {
        hash: "otherhash",
        createdAt: new Date(),
        gtins,
        id: "2",
        confidenceLevel: ConfidenceLevel.High,
        upload: {
          createdBy: { id: "citizen-1", type: UserType.CITOYEN, organizationId: null },
          organizationId: null,
        },
      },
    ])

    const resultSameCitizen = await checkOldProduct(gtins, "newhash", ConfidenceLevel.High, {
      userId: "citizen-1",
      userType: UserType.CITOYEN,
      organizationId: null,
    })
    expect(resultSameCitizen.result).toBe(ProductCheckResult.TooRecent)

    const resultOtherCitizen = await checkOldProduct(gtins, "newhash", ConfidenceLevel.High, {
      userId: "citizen-2",
      userType: UserType.CITOYEN,
      organizationId: null,
    })
    expect(resultOtherCitizen.result).toBe(ProductCheckResult.TooRecent)

    const resultOtherPro = await checkOldProduct(gtins, "newhash", ConfidenceLevel.High, {
      userId: "citizen-3",
      userType: UserType.PROFESSIONNEL,
      organizationId: "org-1",
    })
    expect(resultOtherPro.result).toBe(ProductCheckResult.TooRecent)
  })

  it("should block a citizen only when the same citizen declared it recently", async () => {
    jest.spyOn(productDb, "getLastProductsByGtins").mockResolvedValue([
      {
        hash: "otherhash",
        createdAt: new Date(),
        gtins,
        id: "2",
        confidenceLevel: ConfidenceLevel.Low,
        upload: {
          createdBy: { id: "citizen-1", type: UserType.CITOYEN, organizationId: null },
          organizationId: null,
        },
      },
    ])

    const resultSameCitizen = await checkOldProduct(gtins, "newhash", ConfidenceLevel.Low, {
      userId: "citizen-1",
      userType: UserType.CITOYEN,
      organizationId: null,
    })
    expect(resultSameCitizen.result).toBe(ProductCheckResult.TooRecent)

    const resultOtherCitizen = await checkOldProduct(gtins, "newhash", ConfidenceLevel.Low, {
      userId: "citizen-2",
      userType: UserType.CITOYEN,
      organizationId: null,
    })
    expect(resultOtherCitizen.result).toBe(ProductCheckResult.Valid)
  })

  it("should block a pro only when the same company declared it recently", async () => {
    jest.spyOn(productDb, "getLastProductsByGtins").mockResolvedValue([
      {
        hash: "otherhash",
        createdAt: new Date(),
        gtins,
        id: "2",
        confidenceLevel: ConfidenceLevel.Medium,
        upload: {
          createdBy: { id: "user-3", type: UserType.PROFESSIONNEL, organizationId: "org-1" },
          organizationId: "org-1",
        },
      },
    ])

    const resultSameCompany = await checkOldProduct(gtins, "newhash", ConfidenceLevel.Medium, {
      userId: "user-1",
      userType: UserType.PROFESSIONNEL,
      organizationId: "org-1",
    })
    expect(resultSameCompany.result).toBe(ProductCheckResult.TooRecent)

    const resultOtherCompany = await checkOldProduct(gtins, "newhash", ConfidenceLevel.Medium, {
      userId: "user-2",
      userType: UserType.PROFESSIONNEL,
      organizationId: "org-2",
    })
    expect(resultOtherCompany.result).toBe(ProductCheckResult.Valid)
  })

  it("should return Valid if no product is too recent and hash is different", async () => {
    const oldDate = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000)
    jest.spyOn(productDb, "getLastProductsByGtins").mockResolvedValue([
      {
        hash: "otherhash",
        createdAt: oldDate,
        gtins,
        id: "3",
        confidenceLevel: ConfidenceLevel.High,
        upload: {
          createdBy: { id: "user-1", type: UserType.CITOYEN, organizationId: null },
          organizationId: null,
        },
      },
    ])
    const result = await checkOldProduct(gtins, "newhash", ConfidenceLevel.High, {
      userId: "user-1",
      userType: UserType.CITOYEN,
      organizationId: null,
    })
    expect(result.result).toBe(ProductCheckResult.Valid)
    expect(result.lastProduct).toBeUndefined()
  })
})
