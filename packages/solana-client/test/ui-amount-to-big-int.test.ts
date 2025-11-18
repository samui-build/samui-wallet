import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { uiAmountToBigInt } from '../src/ui-amount-to-big-int.ts'

describe('ui-amount-to-big-int', () => {
  describe('expected behavior', () => {
    it('should convert a whole number to a big integer', () => {
      // ARRANGE
      expect.assertions(1)
      const amount = '1'
      const decimals = 9

      // ACT
      const result = uiAmountToBigInt(amount, decimals)

      // ASSERT
      expect(result).toBe(1_000_000_000n)
    })

    it('should convert a fractional number to a big integer', () => {
      // ARRANGE
      expect.assertions(1)
      const amount = '1.23456789'
      const decimals = 9

      // ACT
      const result = uiAmountToBigInt(amount, decimals)

      // ASSERT
      expect(result).toBe(1_234_567_890n)
    })

    it('should convert a small fractional number to a big integer', () => {
      // ARRANGE
      expect.assertions(1)
      const amount = '0.000000001'
      const decimals = 9

      // ACT
      const result = uiAmountToBigInt(amount, decimals)

      // ASSERT
      expect(result).toBe(1n)
    })

    it('should handle a string with leading or trailing zeros', () => {
      // ARRANGE
      expect.assertions(1)
      const amount = '01.500'
      const decimals = 9

      // ACT
      const result = uiAmountToBigInt(amount, decimals)

      // ASSERT
      expect(result).toBe(1_500_000_000n)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error for an invalid number string', () => {
      // ARRANGE
      expect.assertions(1)
      const amount = 'abc'
      const decimals = 9

      // ACT & ASSERT
      expect(() => uiAmountToBigInt(amount, decimals)).toThrow('Could not parse amount: abc')
    })

    it('should throw an error for a negative number string', () => {
      // ARRANGE
      expect.assertions(1)
      const amount = '-1'
      const decimals = 9

      // ACT & ASSERT
      expect(() => uiAmountToBigInt(amount, decimals)).toThrow('Amount cannot be negative: -1')
    })

    it('should throw an error for a negative decimals value', () => {
      // ARRANGE
      expect.assertions(1)
      const amount = '1'
      const decimals = -9

      // ACT & ASSERT
      expect(() => uiAmountToBigInt(amount, decimals)).toThrow('Decimals must be a non-negative integer: -9')
    })

    it('should throw an error for a non-integer decimals value', () => {
      // ARRANGE
      expect.assertions(1)
      const amount = '1'
      const decimals = 9.5

      // ACT & ASSERT
      expect(() => uiAmountToBigInt(amount, decimals)).toThrow('Decimals must be a non-negative integer: 9.5')
    })
  })
})
