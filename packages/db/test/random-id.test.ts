import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { randomId } from '../src/random-id.ts'

describe('random-id', () => {
  describe('expected behavior', () => {
    it('should create a default id', () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result = randomId()

      // ASSERT
      expect(result).toHaveLength(25)
      expect(result).toMatch(/^[A-Z0-9]+$/)
    })

    it('should create an id with a custom size', () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result = randomId(8)

      // ASSERT
      expect(result).toHaveLength(8)
      expect(result).toMatch(/^[A-Z0-9]+$/)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should create an empty id with a size of zero', () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const result = randomId(0)

      // ASSERT
      expect(result).toBe('')
    })
  })
})
