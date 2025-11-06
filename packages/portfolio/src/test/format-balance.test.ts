import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatBalance } from '../data-access/format-balance.ts'
import { formatBalanceUsd } from '../data-access/format-balance-usd.ts'
import { formatUsdValue } from '../data-access/format-usd-value.ts'

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
