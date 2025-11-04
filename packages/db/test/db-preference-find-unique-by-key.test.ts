import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key.ts'
import { dbPreferenceSetValue } from '../src/db-preference-set-value.ts'
import type { Preference } from '../src/entity/preference.ts'
import type { PreferenceKey } from '../src/entity/preference-key.ts'
import { createDbTest, testPreferenceInputSet } from './test-helpers.ts'

const db = createDbTest()

describe('db-preference-find-unique-by-key', () => {
  beforeEach(async () => {
    await db.preferences.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique preference', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testPreferenceInputSet()
      await dbPreferenceSetValue(db, key, value)

      // ACT
      const result = await dbPreferenceFindUniqueByKey(db, key)

      // ASSERT
      expect(result).toBeDefined()
      expect(result?.value).toBe(value)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding a unique preference fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const key: PreferenceKey = 'activeClusterId'
      vi.spyOn(db.preferences, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Preference | undefined>,
      )

      // ACT & ASSERT
      await expect(dbPreferenceFindUniqueByKey(db, key)).rejects.toThrow(`Error finding preference with key ${key}`)
    })
  })
})
