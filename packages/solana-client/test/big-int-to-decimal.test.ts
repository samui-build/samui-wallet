import { describe, expect, it } from 'vitest'
import { bigIntToDecimal } from '../src/big-int-to-decimal.ts'

describe('big-int-to-decimal', () => {
  it('should convert a bigint to a decimal number', () => {
    // ARRANGE
    expect.assertions(1)
    const value = 1_234_567_890n
    const decimals = 9
    // ACT
    const result = bigIntToDecimal(value, decimals)
    // ASSERT
    expect(result).toBe(1.23456789)
  })

  it('should handle number type', () => {
    // ARRANGE
    expect.assertions(1)
    const value = 1_000_000_000
    const decimals = 9
    // ACT
    const result = bigIntToDecimal(value, decimals)
    // ASSERT
    expect(result).toBe(1)
  })

  it('should handle zero decimals', () => {
    // ARRANGE
    expect.assertions(1)
    const value = 123n
    const decimals = 0
    // ACT
    const result = bigIntToDecimal(value, decimals)
    // ASSERT
    expect(result).toBe(123)
  })
})
