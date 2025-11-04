import { describe, expect, it } from 'vitest'

import { solToLamports } from '../src/sol-to-lamports.ts'

describe('sol-to-lamports', () => {
  describe('expected behavior', () => {
    it('should convert a whole number of SOL to lamports', () => {
      // ARRANGE
      expect.assertions(1)
      const sol = '1'

      // ACT
      const result = solToLamports(sol)

      // ASSERT
      expect(result).toBe(1_000_000_000n)
    })

    it('should convert a fractional number of SOL to lamports', () => {
      // ARRANGE
      expect.assertions(1)
      const sol = '1.23456789'

      // ACT
      const result = solToLamports(sol)

      // ASSERT
      expect(result).toBe(1_234_567_890n)
    })

    it('should convert a small fractional number of SOL to lamports', () => {
      // ARRANGE
      expect.assertions(1)
      const sol = '0.000000001'

      // ACT
      const result = solToLamports(sol)

      // ASSERT
      expect(result).toBe(1n)
    })

    it('should handle a string with leading or trailing zeros', () => {
      // ARRANGE
      expect.assertions(1)
      const sol = '01.500'

      // ACT
      const result = solToLamports(sol)

      // ASSERT
      expect(result).toBe(1_500_000_000n)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid number string', () => {
      // ARRANGE
      expect.assertions(1)
      const sol = 'abc'

      // ACT & ASSERT
      expect(() => solToLamports(sol)).toThrow('Could not parse token quantity: abc')
    })

    it('should throw an error for a negative number string', () => {
      // ARRANGE
      expect.assertions(1)
      const sol = '-1'

      // ACT & ASSERT
      expect(() => solToLamports(sol)).toThrow()
    })
  })
})
