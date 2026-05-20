import { getSVG } from "../../../utils/label/svg"
import { GET } from "./route"
import { NextRequest } from "next/server"

jest.mock("../../../utils/label/svg", () => ({
  getSVG: jest.fn(() => "<svg>test svg content</svg>"),
}))

const mockGetSVG = getSVG as jest.MockedFunction<typeof getSVG>

describe("Image generator", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should generate SVG with valid score and masse", async () => {
    const request = new NextRequest("http://localhost/api/image?type=score&score=85.5&masse=250")

    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("image/svg+xml")
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=2592000")

    expect(mockGetSVG).toHaveBeenCalledWith(85.5, 0.0342)

    const svgContent = await response.text()
    expect(svgContent).toBe("<svg>test svg content</svg>")
  })

  it("should return 400 when score parameter is missing", async () => {
    const request = new NextRequest("http://localhost/api/image?type=score&masse=250")

    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it("should return 500 when getSVG throws an error", async () => {
    mockGetSVG.mockImplementation(() => {
      throw new Error("SVG generation failed")
    })

    const request = new NextRequest("http://localhost/api/image?type=score&score=85.5&masse=250")

    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe("Erreur interne du serveur")
  })
})
