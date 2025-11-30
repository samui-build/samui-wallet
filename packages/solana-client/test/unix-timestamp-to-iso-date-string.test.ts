import { assertIsUnixTimestamp } from '@solana/kit'
import { describe, expect, it } from 'vitest'
import { unixTimestampToIsoDateString } from '../src/unix-timestamp-to-iso-date-string.ts'

describe('timestamp-to-locale-date-string', () => {
  describe('expected behavior', () => {
    it('should format a date as YYYY-MM-DD', () => {
      // ARRANGE
      expect.assertions(1)
      const timestamp = 1764421483n
      assertIsUnixTimestamp(timestamp)
      // ACT
      const result = unixTimestampToIsoDateString(timestamp)

      // ASSERT
      expect(result).toBe('2025-11-29')
    })
  })
})
