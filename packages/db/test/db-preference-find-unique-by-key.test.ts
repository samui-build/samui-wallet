import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Preference } from '../src/entity/preference'
import type { PreferenceKey } from '../src/entity/preference-key'

import { dbPreferenceCreate } from '../src/db-preference-create'
import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key'
import { createDbTest, testPreferenceInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-preference-find-unique-by-key', () => {
  beforeEach(async () => {
    await db.preferences.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique preference', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testPreferenceInputCreate()
      const key = await dbPreferenceCreate(db, input)

      // ACT
      const item = await dbPreferenceFindUniqueByKey(db, key)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.value).toBe(input.value)
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
