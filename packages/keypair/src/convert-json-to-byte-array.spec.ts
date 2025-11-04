import { describe, expect, it } from 'vitest'

import { convertJsonToByteArray } from './convert-json-to-byte-array.ts'

describe('convert-json-to-byte-array', () => {
  describe('expected behavior', () => {
    it('should convert a JSON string to a byte array', () => {
      // ARRANGE
      expect.assertions(1)
      const json = '[1,2,3,4,5]'
      const expectedByteArray = new Uint8Array([1, 2, 3, 4, 5])

      // ACT
      const result = convertJsonToByteArray(json)

      // ASSERT
      expect(result).toEqual(expectedByteArray)
    })

    it('should return an empty byte array for an empty JSON array string', () => {
      // ARRANGE
      expect.assertions(1)
      const json = '[]'
      const expectedByteArray = new Uint8Array([])

      // ACT
      const result = convertJsonToByteArray(json)

      // ASSERT
      expect(result).toEqual(expectedByteArray)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error for an invalid input type', () => {
      // ARRANGE
      expect.assertions(1)
      const invalidInput = [1, 2, 3, 4, 5]

      // ACT & ASSERT
      // @ts-expect-error: testing invalid input
      expect(() => convertJsonToByteArray(invalidInput)).toThrow(`Invalid input: expected a string`)
    })

    it('should throw an error for an invalid JSON string', () => {
      // ARRANGE
      expect.assertions(1)
      const invalidJson = 'not a json string'

      // ACT & ASSERT
      expect(() => convertJsonToByteArray(invalidJson)).toThrow('Invalid JSON: failed to parse')
    })

    it('should throw an error for a JSON that is not an array', () => {
      // ARRANGE
      expect.assertions(1)
      const invalidJson = '{"foo":"bar"}'

      // ACT & ASSERT
      expect(() => convertJsonToByteArray(invalidJson)).toThrow('Invalid JSON: expected an array')
    })

    it('should throw an error for a JSON array with non-numeric values', () => {
      // ARRANGE
      expect.assertions(1)
      const invalidJson = '[1,2,"3",4,5]'

      // ACT & ASSERT
      expect(() => convertJsonToByteArray(invalidJson)).toThrow(
        'Invalid JSON: array must contain only numbers between 0 and 255',
      )
    })

    it('should throw an error for a JSON array with numbers outside the byte range', () => {
      // ARRANGE
      expect.assertions(1)
      const invalidJson = '[1,2,256,4,5]'

      // ACT & ASSERT
      expect(() => convertJsonToByteArray(invalidJson)).toThrow(
        'Invalid JSON: array must contain only numbers between 0 and 255',
      )
    })
  })
})
