import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { parseStrict } from '../src/parse-strict.ts'

describe('parse-strict', () => {
  describe('expected behavior', () => {
    it('should remove undefined values from an object', () => {
      // ARRANGE
      expect.assertions(2)
      const input = {
        count: 0,
        enabled: false,
        missing: undefined,
        name: '',
        nested: null,
      }

      // ACT
      const result = parseStrict(input)

      // ASSERT
      expect(result).toEqual({
        count: 0,
        enabled: false,
        name: '',
        nested: null,
      })
      expect(result).not.toHaveProperty('missing')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return an empty object when all values are undefined', () => {
      // ARRANGE
      expect.assertions(1)
      const input = {
        missing1: undefined,
        missing2: undefined,
      }

      // ACT
      const result = parseStrict(input)

      // ASSERT
      expect(result).toEqual({})
    })
  })
})
