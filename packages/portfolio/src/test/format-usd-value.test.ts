import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatUsdValue } from '../data-access/format-usd-value.ts'

describe('formatUsdValue', () => {
  describe('expected behavior', () => {
    it('should format zero USD value', () => {
      // ARRANGE
      expect.assertions(1)
      const input = 0

      // ACT
      const result = formatUsdValue(input)

      // ASSERT
      expect(result).toBe('$0.00')
    })

    it('should format normal USD values with exactly 2 decimals', () => {
      // ARRANGE
      expect.assertions(1)
      const input = 123.456789

      // ACT
      const result = formatUsdValue(input)

      // ASSERT
      expect(result).toBe('$123.46')
    })

    it('should format large USD values with commas', () => {
      // ARRANGE
      expect.assertions(1)
      const input = 1234567.89

      // ACT
      const result = formatUsdValue(input)

      // ASSERT
      expect(result).toBe('$1,234,567.89')
    })

    it('should format small USD values to exactly 2 decimals', () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result1 = formatUsdValue(0.12)
      const result2 = formatUsdValue(0.1234)
      const result3 = formatUsdValue(0.12345)

      // ASSERT
      expect(result1).toBe('$0.12')
      expect(result2).toBe('$0.12')
      expect(result3).toBe('$0.12')
    })

    it('should format very small USD values with threshold', () => {
      // ARRANGE
      expect.assertions(1)
      const input = 0.005

      // ACT
      const result = formatUsdValue(input)

      // ASSERT
      expect(result).toBe('<$0.01')
    })

    it('should handle edge cases around $1', () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result1 = formatUsdValue(0.99)
      const result2 = formatUsdValue(1.0)
      const result3 = formatUsdValue(1.01)

      // ASSERT
      expect(result1).toBe('$0.99')
      expect(result2).toBe('$1.00')
      expect(result3).toBe('$1.01')
    })

    it('should handle precision edge cases', () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      const result1 = formatUsdValue(0.01)
      const result2 = formatUsdValue(0.009)
      const result3 = formatUsdValue(0.0099)
      const result4 = formatUsdValue(0.001)

      // ASSERT
      expect(result1).toBe('$0.01')
      expect(result2).toBe('<$0.01')
      expect(result3).toBe('<$0.01')
      expect(result4).toBe('<$0.01')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should handle negative USD values', () => {
      // ARRANGE
      expect.assertions(1)
      const input = -123.45

      // ACT
      const result = formatUsdValue(input)

      // ASSERT
      expect(result).toBe('-$123.45')
    })

    it('should handle very small negative values', () => {
      // ARRANGE
      expect.assertions(1)
      const input = -0.005

      // ACT
      const result = formatUsdValue(input)

      // ASSERT
      expect(result).toBe('<$0.01')
    })

    it('should handle Infinity values', () => {
      // ARRANGE
      expect.assertions(1)
      const input = Infinity

      // ACT
      const result = formatUsdValue(input)

      // ASSERT
      expect(result).toBe('$0.00')
    })

    it('should handle NaN values', () => {
      // ARRANGE
      expect.assertions(1)
      const input = NaN

      // ACT
      const result = formatUsdValue(input)

      // ASSERT
      expect(result).toBe('$0.00')
    })
  })
})
