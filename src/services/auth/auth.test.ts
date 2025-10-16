jest.mock("./config", () => ({
  authOptions: {},
}))

jest.mock("../../db/user", () => ({
  getUserByApiKey: jest.fn(),
}))

import { getApiUser } from "./auth"
import { getUserByApiKey } from "../../db/user"

const mockGetUserByApiKey = getUserByApiKey as jest.MockedFunction<typeof getUserByApiKey>

describe("getApiUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("with valid Authorization header", () => {
    it("should return user data when Bearer token is valid", async () => {
      const mockUserData = {
        key: "valid-api-key",
        user: {
          id: "user-123",
          email: "test@example.com",
          organization: {
            id: "org-123",
            name: "Test Organization",
            brands: [{ name: "Test Brand" }],
            authorizedBy: [],
          },
        },
      }

      mockGetUserByApiKey.mockResolvedValue(mockUserData)

      const headers = new Headers()
      headers.set("Authorization", "Bearer valid-api-key")

      const result = await getApiUser(headers)

      expect(result).toEqual(mockUserData)
      expect(mockGetUserByApiKey).toHaveBeenCalledWith("valid-api-key")
      expect(mockGetUserByApiKey).toHaveBeenCalledTimes(1)
    })

    it("should return null when Bearer token is invalid", async () => {
      mockGetUserByApiKey.mockResolvedValue(null)

      const headers = new Headers()
      headers.set("Authorization", "Bearer invalid-api-key")

      const result = await getApiUser(headers)

      expect(result).toBeNull()
      expect(mockGetUserByApiKey).toHaveBeenCalledWith("invalid-api-key")
      expect(mockGetUserByApiKey).toHaveBeenCalledTimes(1)
    })

    it("should handle getUserByApiKey throwing an error", async () => {
      mockGetUserByApiKey.mockRejectedValue(new Error("Database error"))

      const headers = new Headers()
      headers.set("Authorization", "Bearer some-api-key")

      await expect(getApiUser(headers)).rejects.toThrow("Database error")
      expect(mockGetUserByApiKey).toHaveBeenCalledWith("some-api-key")
    })
  })

  describe("with invalid Authorization header format", () => {
    it("should return null when Authorization header is missing", async () => {
      const headers = new Headers()

      const result = await getApiUser(headers)

      expect(result).toBeNull()
      expect(mockGetUserByApiKey).not.toHaveBeenCalled()
    })

    it("should return null when Authorization header is empty", async () => {
      const headers = new Headers()
      headers.set("Authorization", "")

      const result = await getApiUser(headers)

      expect(result).toBeNull()
      expect(mockGetUserByApiKey).not.toHaveBeenCalled()
    })

    it("should return null when Authorization type is not Bearer", async () => {
      const headers = new Headers()
      headers.set("Authorization", "Basic dGVzdDp0ZXN0")

      const result = await getApiUser(headers)

      expect(result).toBeNull()
      expect(mockGetUserByApiKey).not.toHaveBeenCalled()
    })

    it("should return null when Authorization header has wrong format", async () => {
      const headers = new Headers()
      headers.set("Authorization", "InvalidFormat")

      const result = await getApiUser(headers)

      expect(result).toBeNull()
      expect(mockGetUserByApiKey).not.toHaveBeenCalled()
    })

    it("should return null when Bearer token is missing", async () => {
      const headers = new Headers()
      headers.set("Authorization", "Bearer")

      const result = await getApiUser(headers)

      expect(result).toBeNull()
      expect(mockGetUserByApiKey).not.toHaveBeenCalled()
    })

    it("should return null when Authorization header has only Bearer", async () => {
      const headers = new Headers()
      headers.set("Authorization", "Bearer ")

      const result = await getApiUser(headers)

      expect(result).toBeNull()
      expect(mockGetUserByApiKey).not.toHaveBeenCalled()
    })
  })

  describe("return type validation", () => {
    it("should return the exact same object structure as getUserByApiKey", async () => {
      const mockUserData = {
        key: "test-key",
        user: {
          id: "user-id",
          email: "user@test.com",
          organization: {
            id: "org-id",
            name: "Organization Name",
            brands: [{ name: "Brand 1" }, { name: "Brand 2" }],
            authorizedBy: [
              {
                from: {
                  id: "auth-org-id",
                  name: "Auth Org",
                  siret: "1234567890128",
                  brands: [{ id: "brand-id", name: "Auth Brand" }],
                },
              },
            ],
          },
        },
      }

      mockGetUserByApiKey.mockResolvedValue(mockUserData)

      const headers = new Headers()
      headers.set("Authorization", "Bearer test-key")

      const result = await getApiUser(headers)

      expect(result).toEqual(mockUserData)
      expect(result).toBe(mockUserData)
    })

    it("should return null when getUserByApiKey returns null", async () => {
      mockGetUserByApiKey.mockResolvedValue(null)

      const headers = new Headers()
      headers.set("Authorization", "Bearer non-existent-key")

      const result = await getApiUser(headers)

      expect(result).toBeNull()
    })
  })
})
