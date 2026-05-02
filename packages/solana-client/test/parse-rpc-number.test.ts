import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { maybeBigInt, maybeNumber } from '../src/parse-rpc-number.ts'

describe('parse-rpc-number', () => {
  describe('expected behavior', () => {
    it('should parse bigint-compatible values', () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result1 = maybeBigInt(42n)
      const result2 = maybeBigInt(42)
      const result3 = maybeBigInt(' 42 ')

      // ASSERT
      expect(result1).toBe(42n)
      expect(result2).toBe(42n)
      expect(result3).toBe(42n)
    })

    it('should parse finite number-compatible values', () => {
      // ARRANGE
      expect.assertions(3)

      // ACT
      const result1 = maybeNumber(42n)
      const result2 = maybeNumber(42)
      const result3 = maybeNumber('42.5')

      // ASSERT
      expect(result1).toBe(42)
      expect(result2).toBe(42)
      expect(result3).toBe(42.5)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return undefined for bigint-incompatible values', () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      const result1 = maybeBigInt(1.5)
      const result2 = maybeBigInt(Number.NaN)
      const result3 = maybeBigInt('1.5')
      const result4 = maybeBigInt('not-a-number')

      // ASSERT
      expect(result1).toBeUndefined()
      expect(result2).toBeUndefined()
      expect(result3).toBeUndefined()
      expect(result4).toBeUndefined()
    })

    it('should return undefined for invalid number-compatible values', () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      const result1 = maybeNumber(Number.POSITIVE_INFINITY)
      const result2 = maybeNumber(Number.NaN)
      const result3 = maybeNumber('')
      const result4 = maybeNumber('not-a-number')

      // ASSERT
      expect(result1).toBeUndefined()
      expect(result2).toBeUndefined()
      expect(result3).toBeUndefined()
      expect(result4).toBeUndefined()
    })
  })
})
