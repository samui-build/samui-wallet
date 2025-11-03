import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbPreferenceGetValue } from '../src/db-preference-get-value.ts'
import { dbPreferenceSetValue } from '../src/db-preference-set-value.ts'
import type { Preference } from '../src/entity/preference.ts'
import { createDbTest, testPreferenceInputSet } from './test-helpers.ts'

const db = createDbTest()

describe('db-preference-get-value', () => {
  beforeEach(async () => {
    await db.preferences.clear()
  })

  describe('expected behavior', () => {
    it('should get a preference value when it exists', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testPreferenceInputSet()
      await dbPreferenceSetValue(db, key, value)

      // ACT
      const result = await dbPreferenceGetValue(db, key)

      // ASSERT
      expect(value).toBe(result)
    })

    it('should return null when preference does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testPreferenceInputSet()

      // ACT
      const result = await dbPreferenceGetValue(db, key)

      // ASSERT
      expect(result).toBeNull()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when getting a preference fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testPreferenceInputSet()
      vi.spyOn(db.preferences, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Preference>,
      )

      // ACT & ASSERT
      await expect(dbPreferenceGetValue(db, key)).rejects.toThrow(`Error getting preference with key ${key}`)
    })
  })
})
