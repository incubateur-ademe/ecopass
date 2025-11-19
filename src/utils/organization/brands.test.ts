import { getAuthorizedBrands } from "./brands"

describe("getAuthorizedBrands", () => {
  it("should return only active brands from organization", () => {
    const organization = {
      brands: [
        { id: "brand-1", active: true },
        { id: "brand-2", active: false },
        { id: "brand-3", active: true },
      ],
      authorizedBy: [],
    }

    const result = getAuthorizedBrands(organization)

    expect(result).toEqual(["brand-1", "brand-3"])
  })

  it("should return active brands from authorized organizations", () => {
    const organization = {
      brands: [],
      authorizedBy: [
        {
          from: {
            brands: [
              { id: "auth-brand-1", active: true },
              { id: "auth-brand-2", active: false },
            ],
          },
        },
        {
          from: {
            brands: [{ id: "auth-brand-3", active: true }],
          },
        },
      ],
    }

    const result = getAuthorizedBrands(organization)

    expect(result).toEqual(["auth-brand-1", "auth-brand-3"])
  })

  it("should combine organization brands and authorized brands", () => {
    const organization = {
      brands: [
        { id: "own-brand-1", active: true },
        { id: "own-brand-2", active: false },
      ],
      authorizedBy: [
        {
          from: {
            brands: [
              { id: "auth-brand-1", active: true },
              { id: "auth-brand-2", active: false },
            ],
          },
        },
      ],
    }

    const result = getAuthorizedBrands(organization)

    expect(result).toEqual(["own-brand-1", "auth-brand-1"])
  })

  it("should handle empty brands arrays", () => {
    const organization = {
      brands: [],
      authorizedBy: [
        {
          from: {
            brands: [],
          },
        },
      ],
    }

    const result = getAuthorizedBrands(organization)

    expect(result).toHaveLength(0)
  })

  it("should handle empty authorizedBy array", () => {
    const organization = {
      brands: [{ id: "brand-1", active: true }],
      authorizedBy: [],
    }

    const result = getAuthorizedBrands(organization)

    expect(result).toEqual(["brand-1"])
  })

  it("should filter out inactive brands from both sources", () => {
    const organization = {
      brands: [
        { id: "own-inactive", active: false },
        { id: "own-active", active: true },
      ],
      authorizedBy: [
        {
          from: {
            brands: [
              { id: "auth-inactive", active: false },
              { id: "auth-active", active: true },
            ],
          },
        },
      ],
    }

    const result = getAuthorizedBrands(organization)

    expect(result).toEqual(["own-active", "auth-active"])
  })

  it("should handle multiple authorizations from different organizations", () => {
    const organization = {
      brands: [{ id: "own-brand", active: true }],
      authorizedBy: [
        {
          from: {
            brands: [
              { id: "org1-brand1", active: true },
              { id: "org1-brand2", active: false },
            ],
          },
        },
        {
          from: {
            brands: [
              { id: "org2-brand1", active: true },
              { id: "org2-brand2", active: true },
            ],
          },
        },
        {
          from: {
            brands: [{ id: "org3-brand1", active: false }],
          },
        },
      ],
    }

    const result = getAuthorizedBrands(organization)

    expect(result).toEqual(["own-brand", "org1-brand1", "org2-brand1", "org2-brand2"])
  })
})
