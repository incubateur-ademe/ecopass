import { checkOldProduct, ProductCheckResult } from "./oldProduct"
import * as productDb from "../../db/product"

describe("checkOldProduct", () => {
  const gtins = ["1234567890123"]
  const hash = "testhash"

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should return Unchanged if a product with the same hash exists", async () => {
    jest
      .spyOn(productDb, "getLastProductsByGtins")
      .mockResolvedValueOnce([{ hash, createdAt: new Date(), gtins, id: "1" }])

    const result = await checkOldProduct(gtins, hash)
    expect(result.result).toBe(ProductCheckResult.Unchanged)
    expect(result.lastProduct?.hash).toBe(hash)
  })

  it("should return TooRecent if a recent product exists", async () => {
    jest
      .spyOn(productDb, "getLastProductsByGtins")
      .mockResolvedValueOnce([{ hash: "otherhash", createdAt: new Date(), gtins, id: "2" }])
    const result = await checkOldProduct(gtins, "newhash")

    expect(result.result).toBe(ProductCheckResult.TooRecent)
    expect(result.lastProduct?.hash).toBe("otherhash")
  })

  it("should return Valid if no product is too recent and hash is different", async () => {
    const oldDate = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000)
    jest
      .spyOn(productDb, "getLastProductsByGtins")
      .mockResolvedValueOnce([{ hash: "otherhash", createdAt: oldDate, gtins, id: "3" }])
    const result = await checkOldProduct(gtins, "newhash")
    expect(result.result).toBe(ProductCheckResult.Valid)
    expect(result.lastProduct).toBeUndefined()
  })
})
