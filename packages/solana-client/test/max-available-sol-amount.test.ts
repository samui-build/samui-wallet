import { describe, expect, it } from 'vitest'

import { maxAvailableSolAmount } from '../src/max-available-sol-amount'

describe('max-available-sol-amount', () => {
  describe('expected behavior', () => {
    it('should return requested amount when balance is sufficient', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 1_000_000_000n
      const requested = 500_000_000n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(500_000_000n)
    })

    it('should return max sendable when requested exceeds available', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 500_000_000n
      const requested = 1_000_000_000n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(499_995_000n) // 0.5 SOL - 5000 lamports fee
    })

    it('should account for transaction fee when calculating max sendable', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 1_000_000_000n
      const requested = 1_000_000_000n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(999_995_000n) // 1 SOL - 5000 lamports fee
    })

    it('should return 0 when available balance is less than transaction fee', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 4000n
      const requested = 10000n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(0n)
    })

    it('should return 0 when available balance equals transaction fee', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 5000n // Exactly the fee
      const requested = 5000n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(0n)
    })

    it('should handle minimal sendable amount correctly', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 5001n // Just enough for fee + 1 lamport
      const requested = 1n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(1n)
    })

    it('should handle zero requested amount', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 1_000_000_000n
      const requested = 0n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(0n)
    })

    it('should handle zero available balance', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 0n
      const requested = 1_000_000_000n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(0n)
    })

    it('should handle large SOL amounts', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 1000_000_000_000n //
      const requested = 999_000_000_000n //

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(999_000_000_000n)
    })
  })

  describe('unexpected behavior', () => {
    it('should return available minus fee when trying to send entire balance', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 10_000_000n
      const requested = 10_000_000n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(9_995_000n) // Cannot send entire balance due to fee
    })

    it('should handle dust amounts below transaction fee', () => {
      // ARRANGE
      expect.assertions(1)
      const available = 1000n
      const requested = 1000n

      // ACT
      const result = maxAvailableSolAmount(available, requested)

      // ASSERT
      expect(result).toBe(0n)
    })
  })
})
