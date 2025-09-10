import { processUploadsToQueue } from "./uploads"
import chardet from "chardet"
import { parseCSV } from "../csv/parse"
import { createProducts } from "../../db/product"
import { failUpload, completeUpload } from "../../services/upload"
import { checkUploadsStatus, getFirstFileUpload, updateUploadToPending } from "../../db/upload"
import { downloadFileFromS3 } from "../s3/bucket"
import { FileUpload } from "../../db/upload"
import { Status } from "../../../prisma/src/prisma"
import { decryptAndDezipFile } from "../encryption/encryption"

jest.mock("chardet")
jest.mock("../csv/parse")
jest.mock("../../db/product")
jest.mock("../../services/upload")
jest.mock("../../db/upload")
jest.mock("../s3/bucket")
jest.mock("../encryption/encryption")

const mockedChardet = chardet as jest.Mocked<typeof chardet>
const mockedParseCSV = parseCSV as jest.MockedFunction<typeof parseCSV>
const mockedCreateProducts = createProducts as jest.MockedFunction<typeof createProducts>
const mockedFailUpload = failUpload as jest.MockedFunction<typeof failUpload>
const mockedCompleteUpload = completeUpload as jest.MockedFunction<typeof completeUpload>
const mockedCheckUploadStatus = checkUploadsStatus as jest.MockedFunction<typeof checkUploadsStatus>
const mockedGetFirstFileUpload = getFirstFileUpload as jest.MockedFunction<typeof getFirstFileUpload>
const mockedUpdateUploadToPending = updateUploadToPending as jest.MockedFunction<typeof updateUploadToPending>
const mockedDownloadFileFromS3 = downloadFileFromS3 as jest.MockedFunction<typeof downloadFileFromS3>
const mockedDecryptAndDezipFile = decryptAndDezipFile as jest.MockedFunction<typeof decryptAndDezipFile>

describe("processUploadsToQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockUpload = {
    id: "test-upload-id",
    name: "test-file.csv",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    createdBy: {
      email: "test@example.com",
      organization: {
        name: "Test Organization",
      },
    },
    products: [{ status: Status.Pending }],
    reUploadProducts: [],
  } satisfies FileUpload

  const mockBuffer = Buffer.from("csv,data,here")
  const mockParsedData = {
    products: [
      {
        error: null,
        hash: "test-hash",
        status: Status.Pending,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploadId: "test-upload-id",
        uploadOrder: 0,
        id: "product-1",
        gtins: ["1234567891113", "1234567891012"],
        internalReference: "My-ref",
        brand: "TOTALENERGIES SE",
        declaredScore: 123,
        business: "large-business-without-services",
        countrySpinning: "CN",
        countryDyeing: "FR",
        countryFabric: "FR",
        countryMaking: "FR",
        mass: "0.15",
        numberOfReferences: "100000",
        price: "10",
        category: "tshirt",
        upcycled: "false",
        impression: "",
        impressionPercentage: "undefined",
        airTransportRatio: "undefined",
        fading: "false",
        materials: undefined,
        accessories: undefined,
      },
    ],
    materials: [],
    accessories: [],
  }

  it("should process upload successfully when upload exists", async () => {
    mockedGetFirstFileUpload.mockResolvedValue(mockUpload)
    mockedDownloadFileFromS3.mockResolvedValue(Buffer.from("encrypted-zip-data"))
    mockedDecryptAndDezipFile.mockResolvedValue(mockBuffer)
    mockedChardet.detect.mockReturnValue("utf-8")
    mockedParseCSV.mockResolvedValue(mockParsedData)
    mockedCreateProducts.mockResolvedValue(1)

    await processUploadsToQueue()

    expect(mockedGetFirstFileUpload).toHaveBeenCalledTimes(1)
    expect(mockedDownloadFileFromS3).toHaveBeenCalledWith("test-upload-id", "upload")
    expect(mockedDecryptAndDezipFile).toHaveBeenCalledWith(Buffer.from("encrypted-zip-data"))
    expect(mockedUpdateUploadToPending).toHaveBeenCalledWith("test-upload-id")
    expect(mockedChardet.detect).toHaveBeenCalledWith(mockBuffer)
    expect(mockedParseCSV).toHaveBeenCalledWith(mockBuffer, "utf-8", mockUpload)
    expect(mockedCreateProducts).toHaveBeenCalledWith(mockParsedData)
    expect(mockedCompleteUpload).not.toHaveBeenCalled()
  })

  it("should return early when no upload exists", async () => {
    mockedGetFirstFileUpload.mockResolvedValue(null)

    await processUploadsToQueue()

    expect(mockedGetFirstFileUpload).toHaveBeenCalledTimes(1)
    expect(mockedDownloadFileFromS3).not.toHaveBeenCalled()
    expect(mockedDecryptAndDezipFile).not.toHaveBeenCalled()
    expect(mockedUpdateUploadToPending).not.toHaveBeenCalled()
    expect(mockedChardet.detect).not.toHaveBeenCalled()
    expect(mockedParseCSV).not.toHaveBeenCalled()
    expect(mockedCreateProducts).not.toHaveBeenCalled()
  })

  it("should handle encoding detection correctly for specific encoding", async () => {
    mockedGetFirstFileUpload.mockResolvedValue(mockUpload)
    mockedDownloadFileFromS3.mockResolvedValue(Buffer.from("encrypted-zip-data"))
    mockedDecryptAndDezipFile.mockResolvedValue(mockBuffer)
    mockedChardet.detect.mockReturnValue("iso-8859-1")
    mockedParseCSV.mockResolvedValue(mockParsedData)
    mockedCreateProducts.mockResolvedValue(1)

    await processUploadsToQueue()

    expect(mockedParseCSV).toHaveBeenCalledWith(mockBuffer, "latin1", mockUpload)
  })

  it("should check upload status when 0 products are created", async () => {
    const mockEmptyParsedData = {
      products: [],
      materials: [],
      accessories: [],
    }

    mockedGetFirstFileUpload.mockResolvedValue(mockUpload)
    mockedDownloadFileFromS3.mockResolvedValue(Buffer.from("encrypted-zip-data"))
    mockedDecryptAndDezipFile.mockResolvedValue(mockBuffer)
    mockedChardet.detect.mockReturnValue("utf-8")
    mockedParseCSV.mockResolvedValue(mockEmptyParsedData)
    mockedCreateProducts.mockResolvedValue(0)

    await processUploadsToQueue()

    expect(mockedGetFirstFileUpload).toHaveBeenCalledTimes(1)
    expect(mockedDownloadFileFromS3).toHaveBeenCalledWith("test-upload-id", "upload")
    expect(mockedDecryptAndDezipFile).toHaveBeenCalledWith(Buffer.from("encrypted-zip-data"))
    expect(mockedUpdateUploadToPending).toHaveBeenCalledWith("test-upload-id")
    expect(mockedChardet.detect).toHaveBeenCalledWith(mockBuffer)
    expect(mockedParseCSV).toHaveBeenCalledWith(mockBuffer, "utf-8", mockUpload)
    expect(mockedCreateProducts).toHaveBeenCalledWith(mockEmptyParsedData)
    expect(mockedCheckUploadStatus).toHaveBeenCalledWith([mockUpload.id])
    expect(mockedFailUpload).not.toHaveBeenCalled()
  })

  it("should fail upload with generic error message when generic error occurs", async () => {
    mockedGetFirstFileUpload.mockResolvedValue(mockUpload)
    mockedDownloadFileFromS3.mockRejectedValue(new Error("Test error"))

    await processUploadsToQueue()

    expect(mockedFailUpload).toHaveBeenCalledWith(mockUpload, "Test error")
  })

  it("should fail upload with specific message for CSV inconsistent columns error", async () => {
    mockedGetFirstFileUpload.mockResolvedValue(mockUpload)
    mockedDownloadFileFromS3.mockResolvedValue(Buffer.from("encrypted-zip-data"))
    mockedDecryptAndDezipFile.mockResolvedValue(mockBuffer)
    mockedChardet.detect.mockReturnValue("utf-8")
    mockedParseCSV.mockRejectedValue({
      message: "CSV parsing error",
      code: "CSV_RECORD_INCONSISTENT_COLUMNS",
    })

    await processUploadsToQueue()

    expect(mockedFailUpload).toHaveBeenCalledWith(
      mockUpload,
      "Le fichier CSV contient des lignes avec un nombre de colonnes différent",
    )
  })

  it("should fail upload with default message when error is not an object", async () => {
    mockedGetFirstFileUpload.mockResolvedValue(mockUpload)
    mockedDownloadFileFromS3.mockRejectedValue("string error")

    await processUploadsToQueue()

    expect(mockedFailUpload).toHaveBeenCalledWith(mockUpload, "Erreur lors de l'analyse du fichier CSV")
  })
})
