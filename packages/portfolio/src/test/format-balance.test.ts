import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatBalance } from '../data-access/format-balance.ts'

describe('formatBalance', () => {
  describe('expected behavior', () => {
    it('should format zero balance', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 0n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('0')
    })

    it('should format basic SOL balance correctly', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1000000000n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('1')
    })

    it('should format fractional SOL balance with proper precision', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 695954101n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('0.69595')
    })

    it('should format small token amounts with high precision', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 123456n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('0.00012')
    })

    it('should format very small amounts below threshold', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('<0.00001')
    })

    it('should format millions with M suffix', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 2500000000000000n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('2.5M')
    })

    it('should format billions with B suffix', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1500000000000000000n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('1.5B')
    })

    it('should format trillions with T suffix', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1200000000000000000000n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('1.2T')
    })

    it('should use appropriate precision for different ranges', () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      const result1 = formatBalance({ balance: 1234000000000n, decimals: 9 }) // 1234 SOL
      const result2 = formatBalance({ balance: 12340000000n, decimals: 9 }) // 12.34 SOL
      const result3 = formatBalance({ balance: 1234000000n, decimals: 9 }) // 1.234 SOL
      const result4 = formatBalance({ balance: 123400000n, decimals: 9 }) // 0.1234 SOL

      // ASSERT
      expect(result1).toBe('1,234')
      expect(result2).toBe('12.34')
      expect(result3).toBe('1.234')
      expect(result4).toBe('0.1234')
    })

    it('should handle 6-decimal tokens correctly', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: 1234567n, decimals: 6 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('1.23457')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should handle negative balances', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: -1000000000n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('-1')
    })

    it('should handle very large negative balances', () => {
      // ARRANGE
      expect.assertions(1)
      const input = { balance: -1500000000000000000n, decimals: 9 }

      // ACT
      const result = formatBalance(input)

      // ASSERT
      expect(result).toBe('-1.5B')
    })
  })
})
