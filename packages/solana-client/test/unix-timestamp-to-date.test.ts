import { assertIsUnixTimestamp } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { unixTimestampToDate } from '../src/unix-timestamp-to-date.ts'

describe('unix-timestamp-to-date', () => {
  describe('expected behavior', () => {
    it('should convert a Unix timestamp to a Date object', () => {
      // ARRANGE
      expect.assertions(1)
      const timestamp = 1764421483n
      assertIsUnixTimestamp(timestamp)

      // ACT
      const result = unixTimestampToDate(timestamp)

      // ASSERT
      expect(result).toEqual(new Date(1764421483000))
    })

    it('should return null when input is null', () => {
      // ARRANGE
      expect.assertions(1)
      const timestamp = null

      // ACT
      const result = unixTimestampToDate(timestamp)

      // ASSERT
      expect(result).toBeNull()
    })
  })
})
