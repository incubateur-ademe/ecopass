import { processExportsQueue } from "./exports"
import { completeExport, getFirstExport } from "../../db/export"
import { getProductsByOrganizationIdAndBrandBefore } from "../../db/product"
import { getSVG } from "../label/svg"
import { uploadFileToS3 } from "../s3/bucket"
import { Status } from "../../../prisma/src/prisma"
import JSZip from "jszip"

jest.mock("../../db/export")
jest.mock("../../db/product")
jest.mock("../label/svg")
jest.mock("../s3/bucket")
jest.mock("jszip")

const mockedCompleteExport = completeExport as jest.MockedFunction<typeof completeExport>
const mockedGetFirstExport = getFirstExport as jest.MockedFunction<typeof getFirstExport>
const mockedGetProductsByOrganizationIdAndBrandBefore =
  getProductsByOrganizationIdAndBrandBefore as jest.MockedFunction<typeof getProductsByOrganizationIdAndBrandBefore>
const mockedGetSVG = getSVG as jest.MockedFunction<typeof getSVG>
const mockedUploadFileToS3 = uploadFileToS3 as jest.MockedFunction<typeof uploadFileToS3>
const mockedJSZip = JSZip as jest.MockedClass<typeof JSZip>

describe("processExportsQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockExport = {
    id: "export-1",
    name: "test-export",
    userId: "user-1",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    status: Status.Pending,
    brand: "Test Brand" as string | null,
    user: {
      organizationId: "org-1" as string | null,
    },
  }

  const mockProduct = {
    id: "product-1",
    internalReference: "REF001",
    brand: "Test Brand",
    gtins: ["1234567890123"],
    createdAt: new Date("2023-01-01T00:00:00Z"),
    category: "T-shirt",
    countryDyeing: "FR",
    countryFabric: "CN",
    countryMaking: "MM",
    score: {
      id: "score-1",
      productId: "product-1",
      score: 85.5,
      standardized: 8.5,
      durability: 0.75,
      acd: 2.73,
      cch: 1589.45,
      etf: 21287.2,
      fru: 4289.7,
      fwe: 0.106,
      htc: 9.04e-8,
      htn: 0.000127,
      ior: 167.8,
      ldu: 51743.2,
      mru: 0.00423,
      ozd: 0.00268,
      pco: 1.548,
      pma: 0.0000423,
      swe: 0.459,
      tre: 5.207,
      wtu: 0,
      microfibers: 0,
      outOfEuropeEOL: 0,
    },
    upload: {
      version: "1.0",
      createdBy: {
        organization: {
          name: "Test Organization",
        },
      },
    },
  }

  it("should return early when no export exists", async () => {
    mockedGetFirstExport.mockResolvedValue(null)

    await processExportsQueue()

    expect(mockedGetFirstExport).toHaveBeenCalledTimes(1)
    expect(mockedGetProductsByOrganizationIdAndBrandBefore).not.toHaveBeenCalled()
    expect(mockedCompleteExport).not.toHaveBeenCalled()
  })

  it("should complete export immediately when user has no organization", async () => {
    mockedGetFirstExport.mockResolvedValue({ ...mockExport, user: { organizationId: null } })

    await processExportsQueue()

    expect(mockedGetFirstExport).toHaveBeenCalledTimes(1)
    expect(mockedCompleteExport).toHaveBeenCalledWith("export-1")
    expect(mockedGetProductsByOrganizationIdAndBrandBefore).not.toHaveBeenCalled()
    expect(mockedGetSVG).not.toHaveBeenCalled()
  })

  it("should return early when no products found", async () => {
    mockedGetFirstExport.mockResolvedValue(mockExport)
    mockedGetProductsByOrganizationIdAndBrandBefore.mockResolvedValue([])

    await processExportsQueue()

    expect(mockedGetFirstExport).toHaveBeenCalledTimes(1)
    expect(mockedGetProductsByOrganizationIdAndBrandBefore).toHaveBeenCalledWith(
      "org-1",
      mockExport.createdAt,
      "Test Brand",
    )
    expect(mockedCompleteExport).toHaveBeenCalledWith("export-1")
    expect(mockedGetSVG).not.toHaveBeenCalled()
  })

  it("should process export successfully with products", async () => {
    const mockSvgContent = "<svg>test svg content</svg>"
    const mockZipFile = jest.fn()
    const mockZipGenerateAsync = jest.fn().mockResolvedValue(Buffer.from("zip-content"))
    const mockZipInstance = {
      file: mockZipFile,
      generateAsync: mockZipGenerateAsync,
    }
    mockedJSZip.mockImplementation(() => mockZipInstance as any)

    mockedGetFirstExport.mockResolvedValue(mockExport)
    mockedGetProductsByOrganizationIdAndBrandBefore.mockResolvedValue([mockProduct])
    mockedGetSVG.mockReturnValue(mockSvgContent)

    await processExportsQueue()

    expect(mockedGetFirstExport).toHaveBeenCalledTimes(1)
    expect(mockedGetProductsByOrganizationIdAndBrandBefore).toHaveBeenCalledWith(
      "org-1",
      mockExport.createdAt,
      "Test Brand",
    )
    expect(mockedGetSVG).toHaveBeenCalledWith(85.5, 8.5)
    expect(mockZipFile).toHaveBeenCalledWith("REF001.svg", mockSvgContent)
    expect(mockZipGenerateAsync).toHaveBeenCalledWith({ type: "nodebuffer" })
    expect(mockedUploadFileToS3).toHaveBeenCalledWith("test-export.zip", Buffer.from("zip-content"), "export")
    expect(mockedCompleteExport).toHaveBeenCalledWith("export-1")
  })

  it("should skip products without score", async () => {
    const mockZipFile = jest.fn()
    const mockZipGenerateAsync = jest.fn().mockResolvedValue(Buffer.from("zip-content"))
    const mockZipInstance = {
      file: mockZipFile,
      generateAsync: mockZipGenerateAsync,
    }
    mockedJSZip.mockImplementation(() => mockZipInstance as any)

    mockedGetFirstExport.mockResolvedValue(mockExport)
    mockedGetProductsByOrganizationIdAndBrandBefore.mockResolvedValue([
      {
        ...mockProduct,
        score: null,
      },
    ])

    await processExportsQueue()

    expect(mockedGetSVG).not.toHaveBeenCalled()
    expect(mockZipFile).not.toHaveBeenCalled()
    expect(mockZipGenerateAsync).toHaveBeenCalledWith({ type: "nodebuffer" })
    expect(mockedUploadFileToS3).toHaveBeenCalledWith("test-export.zip", Buffer.from("zip-content"), "export")
    expect(mockedCompleteExport).toHaveBeenCalledWith("export-1")
  })
})
