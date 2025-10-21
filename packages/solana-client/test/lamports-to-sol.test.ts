import { describe, expect, it } from 'vitest'

import { lamportsToSol } from '../src/lamports-to-sol'

describe('lamports-to-sol', () => {
  describe('expected behavior', () => {
    it('should convert a large number of lamports to SOL', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = 1_000_000_000

      // ACT
      const result = lamportsToSol(lamports)

      // ASSERT
      expect(result).toBe('1')
    })

    it('should convert a large bigint number of lamports to SOL', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = 1_000_000_000n

      // ACT
      const result = lamportsToSol(lamports)

      // ASSERT
      expect(result).toBe('1')
    })

    it('should convert a fractional number of lamports to SOL', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = 1_234_567_890

      // ACT
      const result = lamportsToSol(lamports)

      // ASSERT
      expect(result).toBe('1.23456789')
    })

    it('should convert a small number of lamports to SOL', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = 1

      // ACT
      const result = lamportsToSol(lamports)

      // ASSERT
      expect(result).toBe('0.000000001')
    })

    it('should handle zero lamports', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = 0

      // ACT
      const result = lamportsToSol(lamports)

      // ASSERT
      expect(result).toBe('0')
    })

    it('should respect the decimals parameter', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = 1_234_567_890

      // ACT
      const result = lamportsToSol(lamports, 4)

      // ASSERT
      expect(result).toBe('1.2346')
    })

    it('should cap the decimals parameter at 9', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = 1_234_567_890

      // ACT
      const result = lamportsToSol(lamports, 12)

      // ASSERT
      expect(result).toBe('1.23456789')
    })
  })

  describe('unexpected behavior', () => {
    it('should handle negative lamports', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = -1_000_000_000

      // ACT
      const result = lamportsToSol(lamports)

      // ASSERT
      expect(result).toBe('-1')
    })

    it('should throw an error for negative decimals', () => {
      // ARRANGE
      expect.assertions(1)
      const lamports = 1_000_000_000

      // ACT & ASSERT
      expect(() => lamportsToSol(lamports, -1)).toThrow()
    })
  })
})
