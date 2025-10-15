import { scoreIsValid } from "./score"

describe("scoreIsValid", () => {
  it("should return true for identical scores", () => {
    expect(scoreIsValid(100, 100)).toBe(true)
    expect(scoreIsValid(0, 0)).toBe(true)
    expect(scoreIsValid(1500, 1500)).toBe(true)
  })

  it("should return true for scores with exactly 1% difference", () => {
    expect(scoreIsValid(100, 101)).toBe(true)
    expect(scoreIsValid(101, 100)).toBe(true)
    expect(scoreIsValid(1000, 1010)).toBe(true)
    expect(scoreIsValid(1010, 1000)).toBe(true)
  })

  it("should return true for scores with less than 1% difference", () => {
    expect(scoreIsValid(100, 100.5)).toBe(true)
    expect(scoreIsValid(100.5, 100)).toBe(true)
    expect(scoreIsValid(1000, 1005)).toBe(true)
    expect(scoreIsValid(1500, 1507)).toBe(true)
  })

  it("should return false for scores with more than 1% difference", () => {
    expect(scoreIsValid(100, 102)).toBe(false)
    expect(scoreIsValid(102, 100)).toBe(false)
    expect(scoreIsValid(1000, 1015)).toBe(false)
    expect(scoreIsValid(1500, 1520)).toBe(false)
  })
})
