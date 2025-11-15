import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatBalanceUsd } from '../data-access/format-balance-usd.ts'

describe('formatBalanceUsd', () => {
  describe('expected behavior', () => {
    it('should format zero USD balance', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 0n, decimals: 9, usdPrice: 100 }

      // ACT
      const result = formatBalanceUsd(input)

      // ASSERT
      expect(result).toBe('$0.00')
    })

    it('should format USD balance with exactly 2 decimals for amounts >= $1', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1000000000n, decimals: 9, usdPrice: 123.456789 }

      // ACT
      const result = formatBalanceUsd(input)

      // ASSERT
      expect(result).toBe('$123.46')
    })

    it('should format large USD amounts with commas and 2 decimals', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 10000000000n, decimals: 9, usdPrice: 123.45 }

      // ACT
      const result = formatBalanceUsd(input)

      // ASSERT
      expect(result).toBe('$1,234.50')
    })

    it('should format fractional USD amounts to 2 decimals or show threshold', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1000000n, decimals: 9, usdPrice: 0.5 }

      // ACT
      const result = formatBalanceUsd(input)

      // ASSERT
      expect(result).toBe('<$0.01')
    })

    it('should format very small USD amounts with threshold', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1n, decimals: 9, usdPrice: 0.5 }

      // ACT
      const result = formatBalanceUsd(input)

      // ASSERT
      expect(result).toBe('<$0.01')
    })

    it('should handle undefined USD price', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1000000000n, decimals: 9, usdPrice: undefined }

      // ACT
      const result = formatBalanceUsd(input)

      // ASSERT
      expect(result).toBe('$0.00')
    })

    it('should format cents precisely to 2 decimal places', () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result1 = formatBalanceUsd({ balance: 100000000n, decimals: 9, usdPrice: 0.567 })
      const result2 = formatBalanceUsd({ balance: 100000000n, decimals: 9, usdPrice: 0.123 })
      const result3 = formatBalanceUsd({ balance: 1000000000n, decimals: 9, usdPrice: 0.9999 })

      // ASSERT
      expect(result1).toBe('$0.06')
      expect(result2).toBe('$0.01')
      expect(result3).toBe('$1.00')
    })

    it('should handle number balance input without precision loss', () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result1 = formatBalanceUsd({ balance: 123.45, decimals: 9, usdPrice: 2 })
      const result2 = formatBalanceUsd({ balance: 0.5, decimals: 9, usdPrice: 100 })
      const result3 = formatBalanceUsd({ balance: 1000.123, decimals: 9, usdPrice: 1.5 })

      // ASSERT
      expect(result1).toBe('$246.90')
      expect(result2).toBe('$50.00')
      expect(result3).toBe('$1,500.18')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should handle negative USD balances', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: -1000000000n, decimals: 9, usdPrice: 100 }

      // ACT
      const result = formatBalanceUsd(input)

      // ASSERT
      expect(result).toBe('-$100.00')
    })

    it('should handle negative USD price', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1000000000n, decimals: 9, usdPrice: -100 }

      // ACT
      const result = formatBalanceUsd(input)

      // ASSERT
      expect(result).toBe('-$100.00')
    })
  })
})
