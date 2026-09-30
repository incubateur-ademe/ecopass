import { ConfidenceLevel, UserType } from "@prisma/enums"

const mockFindManyProduct = jest.fn()
const mockFindManyPrefix = jest.fn()
const mockFindManyUser = jest.fn()

const mockSendDailyDeclarationChangedEmail = jest.fn()
const mockSendDailyDeclarationAlertToOwnerAdmins = jest.fn()

jest.mock("../../db/prismaClient", () => ({
  prismaClient: {
    product: {
      findMany: mockFindManyProduct,
    },
    gTINPrefix: {
      findMany: mockFindManyPrefix,
    },
    user: {
      findMany: mockFindManyUser,
    },
  },
}))

jest.mock("../emails/email", () => ({
  sendDailyDeclarationChangedEmail: mockSendDailyDeclarationChangedEmail,
  sendDailyDeclarationAlertToOwnerAdmins: mockSendDailyDeclarationAlertToOwnerAdmins,
}))

describe("runDailyDeclarationNotifications", () => {
  const loadModule = async () => import("./dailyDeclarationNotifications")

  beforeEach(() => {
    jest.resetModules()
    mockFindManyProduct.mockReset()
    mockFindManyPrefix.mockReset()
    mockFindManyUser.mockReset()
    mockSendDailyDeclarationChangedEmail.mockReset()
    mockSendDailyDeclarationAlertToOwnerAdmins.mockReset()
  })

  it("returns empty counters when no daily done products exist", async () => {
    // 1st product.findMany call: no daily Done products in the target period.
    mockFindManyProduct.mockResolvedValueOnce([])

    const { runDailyDeclarationNotifications } = await loadModule()
    const result = await runDailyDeclarationNotifications(new Date("2026-08-18T12:00:00.000Z"))

    expect(result.dailyProducts).toBe(0)
    expect(result.ownerAlerts).toBe(0)
    expect(result.changedNotifications).toBe(0)
    expect(mockFindManyPrefix).not.toHaveBeenCalled()
    expect(mockFindManyUser).not.toHaveBeenCalled()
    expect(mockSendDailyDeclarationAlertToOwnerAdmins).not.toHaveBeenCalled()
    expect(mockSendDailyDeclarationChangedEmail).not.toHaveBeenCalled()
  })

  it("sends owner alert and changed notifications with deduplicated recipients/items", async () => {
    const declarationDate = new Date("2026-08-14T10:00:00.000Z")

    // 1st product.findMany call: daily products query returns one Low-confidence declaration.
    // 2nd product.findMany call: previous declarations for the GTIN (citizen duplicated + two pros same org).
    mockFindManyProduct
      .mockResolvedValueOnce([
        {
          id: "product-1",
          createdAt: declarationDate,
          confidenceLevel: ConfidenceLevel.Low,
          internalReference: "REF-LOW-001",
          gtins: ["1234567890123", "1234567890123"],
          upload: {
            organizationId: "org-declarer",
            createdBy: {
              id: "new-user",
              email: "new@declarer.org",
              type: UserType.PROFESSIONNEL,
              organizationId: "org-declarer",
            },
          },
        },
      ])
      .mockResolvedValueOnce([
        {
          createdAt: new Date("2026-08-10T09:00:00.000Z"),
          gtins: ["1234567890123"],
          upload: {
            organizationId: null,
            createdBy: {
              id: "citizen-1",
              email: "CITIZEN@MAIL.COM",
              type: UserType.CITOYEN,
              organizationId: null,
            },
          },
        },
        {
          createdAt: new Date("2026-08-09T09:00:00.000Z"),
          gtins: ["1234567890123"],
          upload: {
            organizationId: null,
            createdBy: {
              id: "citizen-1",
              email: "CITIZEN@MAIL.COM",
              type: UserType.CITOYEN,
              organizationId: null,
            },
          },
        },
        {
          createdAt: new Date("2026-08-08T09:00:00.000Z"),
          gtins: ["1234567890123"],
          upload: {
            organizationId: "org-previous",
            createdBy: {
              id: "pro-1",
              email: "pro1@previous.org",
              type: UserType.PROFESSIONNEL,
              organizationId: "org-previous",
            },
          },
        },
        {
          createdAt: new Date("2026-08-07T09:00:00.000Z"),
          gtins: ["1234567890123"],
          upload: {
            organizationId: "org-previous",
            createdBy: {
              id: "pro-2",
              email: "pro2@previous.org",
              type: UserType.PROFESSIONNEL,
              organizationId: "org-previous",
            },
          },
        },
      ])

    // gTINPrefix.findMany call: maps GTIN prefix to owner organization.
    mockFindManyPrefix.mockResolvedValueOnce([{ prefix: "123456", organizationId: "org-owner" }])

    // user.findMany call: admins for owner org + previous declarant org (with duplicated email case variation).
    mockFindManyUser.mockResolvedValueOnce([
      { organizationId: "org-owner", email: "OWNER.ADMIN@ORG.COM" },
      { organizationId: "org-previous", email: "PREV.ADMIN@ORG.COM" },
      { organizationId: "org-previous", email: "prev.admin@org.com" },
    ])

    const { runDailyDeclarationNotifications } = await loadModule()
    const result = await runDailyDeclarationNotifications(new Date("2026-08-18T12:00:00.000Z"))

    expect(result.dailyProducts).toBe(1)
    expect(result.ownerAlerts).toBe(1)
    expect(result.changedNotifications).toBe(2)

    expect(mockSendDailyDeclarationAlertToOwnerAdmins).toHaveBeenCalledTimes(1)
    expect(mockSendDailyDeclarationAlertToOwnerAdmins).toHaveBeenCalledWith(
      ["owner.admin@org.com"],
      [
        {
          productId: "product-1",
          gtin: "1234567890123",
          internalReference: "REF-LOW-001",
          confidenceLevel: ConfidenceLevel.Low,
          declaredAt: declarationDate,
        },
      ],
      new Date("2026-08-17T00:00:00.000Z"),
      new Date("2026-08-18T00:00:00.000Z"),
    )

    expect(mockSendDailyDeclarationChangedEmail).toHaveBeenCalledTimes(2)
    expect(mockSendDailyDeclarationChangedEmail).toHaveBeenNthCalledWith(
      1,
      ["citizen@mail.com"],
      [
        {
          productId: "product-1",
          gtin: "1234567890123",
          internalReference: "REF-LOW-001",
          confidenceLevel: ConfidenceLevel.Low,
          declaredAt: declarationDate,
        },
      ],
      new Date("2026-08-17T00:00:00.000Z"),
      new Date("2026-08-18T00:00:00.000Z"),
    )

    expect(mockSendDailyDeclarationChangedEmail).toHaveBeenNthCalledWith(
      2,
      ["prev.admin@org.com"],
      [
        {
          productId: "product-1",
          gtin: "1234567890123",
          internalReference: "REF-LOW-001",
          confidenceLevel: ConfidenceLevel.Low,
          declaredAt: declarationDate,
        },
      ],
      new Date("2026-08-17T00:00:00.000Z"),
      new Date("2026-08-18T00:00:00.000Z"),
    )
  })

  it("does not query GTIN prefix or send owner alerts when all daily products are high confidence", async () => {
    // 1st product.findMany call: daily products only contain High-confidence declarations.
    // 2nd product.findMany call: no previous declarants found for GTINs.
    mockFindManyProduct
      .mockResolvedValueOnce([
        {
          id: "product-high-1",
          createdAt: new Date("2026-08-15T10:00:00.000Z"),
          confidenceLevel: ConfidenceLevel.High,
          internalReference: "REF-HIGH-001",
          gtins: ["9876543210000"],
          upload: {
            organizationId: "org-high",
            createdBy: {
              id: "pro-high",
              email: "high@org.com",
              type: UserType.PROFESSIONNEL,
              organizationId: "org-high",
            },
          },
        },
      ])
      .mockResolvedValueOnce([])

    mockFindManyUser.mockResolvedValueOnce([])

    const { runDailyDeclarationNotifications } = await loadModule()
    const result = await runDailyDeclarationNotifications(new Date("2026-08-18T12:00:00.000Z"))

    expect(result.dailyProducts).toBe(1)
    expect(result.ownerAlerts).toBe(0)
    expect(result.changedNotifications).toBe(0)
    expect(mockFindManyPrefix).not.toHaveBeenCalled()
    expect(mockSendDailyDeclarationAlertToOwnerAdmins).not.toHaveBeenCalled()
  })

  it("routes correct product info per GTIN when one product contains multiple GTINs", async () => {
    const declarationDate = new Date("2026-08-14T10:00:00.000Z")

    // 1st product.findMany call: one daily product with four GTINs.
    // 2nd product.findMany call: previous declarants for both GTINs.
    mockFindManyProduct
      .mockResolvedValueOnce([
        {
          id: "product-multi-gtin",
          createdAt: declarationDate,
          confidenceLevel: ConfidenceLevel.Low,
          internalReference: "REF-MULTI-001",
          gtins: ["1234567890123", "6543210000000", "1122337891011", "3322117891011"],
          upload: {
            organizationId: "org-declarer",
            createdBy: {
              id: "new-user",
              email: "new@declarer.org",
              type: UserType.PROFESSIONNEL,
              organizationId: "org-declarer",
            },
          },
        },
      ])
      .mockResolvedValueOnce([
        {
          createdAt: new Date("2026-08-12T09:00:00.000Z"),
          gtins: ["1234567890123"],
          upload: {
            organizationId: null,
            createdBy: {
              id: "citizen-1",
              email: "citizen@foo.com",
              type: UserType.CITOYEN,
              organizationId: null,
            },
          },
        },
        {
          createdAt: new Date("2026-08-11T09:00:00.000Z"),
          gtins: ["1234567890123"],
          upload: {
            organizationId: "org-prev-1",
            createdBy: {
              id: "pro-1",
              email: "pro1@prev1.org",
              type: UserType.PROFESSIONNEL,
              organizationId: "org-prev-1",
            },
          },
        },
        {
          createdAt: new Date("2026-08-10T09:00:00.000Z"),
          gtins: ["6543210000000"],
          upload: {
            organizationId: "org-prev-2",
            createdBy: {
              id: "pro-2",
              email: "pro2@prev2.org",
              type: UserType.PROFESSIONNEL,
              organizationId: "org-prev-2",
            },
          },
        },
        {
          createdAt: new Date("2026-08-09T08:00:00.000Z"),
          gtins: ["1234561111111"],
          upload: {
            organizationId: "org-prev-1",
            createdBy: {
              id: "pro-3",
              email: "pro3@prev1.org",
              type: UserType.PROFESSIONNEL,
              organizationId: "org-prev-1",
            },
          },
        },
      ])

    // gTINPrefix.findMany call: one GTIN belongs to owner-1, two GTINs belong to owner-2.
    mockFindManyPrefix.mockResolvedValueOnce([
      { prefix: "123456", organizationId: "org-owner-1" },
      { prefix: "654321", organizationId: "org-owner-2" },
      { prefix: "112233", organizationId: "org-owner-2" },
    ])

    // user.findMany call: admins for owner orgs and previous declarant orgs.
    mockFindManyUser.mockResolvedValueOnce([
      { organizationId: "org-owner-1", email: "owner1@org.com" },
      { organizationId: "org-owner-2", email: "owner2@org.com" },
      { organizationId: "org-prev-1", email: "prev1@org.com" },
      { organizationId: "org-prev-2", email: "prev2@org.com" },
    ])

    const { runDailyDeclarationNotifications } = await loadModule()
    const result = await runDailyDeclarationNotifications(new Date("2026-08-18T12:00:00.000Z"))

    expect(result.dailyProducts).toBe(1)
    expect(result.ownerAlerts).toBe(2)
    expect(result.changedNotifications).toBe(3)

    // One email per owner organization, even if multiple GTINs map to the same owner.
    expect(mockSendDailyDeclarationAlertToOwnerAdmins).toHaveBeenCalledTimes(2)

    const ownerCalls = mockSendDailyDeclarationAlertToOwnerAdmins.mock.calls
    const ownerCallForFirstGtin = ownerCalls.find((call) => call[0][0] === "owner1@org.com")
    const ownerCallForSecondGtin = ownerCalls.find((call) => call[0][0] === "owner2@org.com")

    expect(ownerCallForFirstGtin).toBeDefined()
    expect(ownerCallForFirstGtin?.[1]).toEqual([
      {
        productId: "product-multi-gtin",
        gtin: "1234567890123",
        internalReference: "REF-MULTI-001",
        confidenceLevel: ConfidenceLevel.Low,
        declaredAt: declarationDate,
      },
    ])

    expect(ownerCallForSecondGtin).toBeDefined()
    expect(ownerCallForSecondGtin?.[1]).toEqual(
      expect.arrayContaining([
        {
          productId: "product-multi-gtin",
          gtin: "6543210000000",
          internalReference: "REF-MULTI-001",
          confidenceLevel: ConfidenceLevel.Low,
          declaredAt: declarationDate,
        },
        {
          productId: "product-multi-gtin",
          gtin: "1122337891011",
          internalReference: "REF-MULTI-001",
          confidenceLevel: ConfidenceLevel.Low,
          declaredAt: declarationDate,
        },
      ]),
    )
    expect(ownerCallForSecondGtin?.[1]).toHaveLength(2)

    const changedCalls = mockSendDailyDeclarationChangedEmail.mock.calls
    const citizenCall = changedCalls.find((call) => call[0][0] === "citizen@foo.com")
    const prevOrg1Call = changedCalls.find((call) => call[0][0] === "prev1@org.com")
    const prevOrg2Call = changedCalls.find((call) => call[0][0] === "prev2@org.com")

    expect(citizenCall?.[1]).toEqual([
      {
        productId: "product-multi-gtin",
        gtin: "1234567890123",
        internalReference: "REF-MULTI-001",
        confidenceLevel: ConfidenceLevel.Low,
        declaredAt: declarationDate,
      },
    ])

    expect(prevOrg1Call?.[1]).toEqual([
      {
        productId: "product-multi-gtin",
        gtin: "1234567890123",
        internalReference: "REF-MULTI-001",
        confidenceLevel: ConfidenceLevel.Low,
        declaredAt: declarationDate,
      },
    ])

    expect(prevOrg2Call?.[1]).toEqual([
      {
        productId: "product-multi-gtin",
        gtin: "6543210000000",
        internalReference: "REF-MULTI-001",
        confidenceLevel: ConfidenceLevel.Low,
        declaredAt: declarationDate,
      },
    ])
  })
})
