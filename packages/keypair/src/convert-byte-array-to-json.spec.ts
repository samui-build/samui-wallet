import { describe, expect, it } from 'vitest'

import { convertByteArrayToJson } from './convert-byte-array-to-json'

describe('convert-byte-array-to-json', () => {
  describe('expected behavior', () => {
    it('should convert a byte array to a JSON string', () => {
      // ARRANGE
      expect.assertions(1)
      const byteArray = new Uint8Array([1, 2, 3, 4, 5])
      const expectedJson = '[1,2,3,4,5]'

      // ACT
      const result = convertByteArrayToJson(byteArray)

      // ASSERT
      expect(result).toBe(expectedJson)
    })

    it('should return an empty JSON array string for an empty byte array', () => {
      // ARRANGE
      expect.assertions(1)
      const byteArray = new Uint8Array([])
      const expectedJson = '[]'

      // ACT
      const result = convertByteArrayToJson(byteArray)

      // ASSERT
      expect(result).toBe(expectedJson)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid input type', () => {
      // ARRANGE
      expect.assertions(1)
      const invalidInput = [1, 2, 3, 4, 5]

      // ACT & ASSERT
      // @ts-expect-error: testing invalid input
      expect(() => convertByteArrayToJson(invalidInput)).toThrow(`Invalid input: expected a Uint8Array`)
    })
  })
})
