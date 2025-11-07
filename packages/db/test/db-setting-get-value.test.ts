import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbSettingGetValue } from '../src/db-setting-get-value.ts'
import { dbSettingSetValue } from '../src/db-setting-set-value.ts'
import type { Setting } from '../src/entity/setting.ts'
import { createDbTest, testSettingInputSet } from './test-helpers.ts'

const db = createDbTest()

describe('db-setting-get-value', () => {
  beforeEach(async () => {
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should get a setting value when it exists', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingInputSet()
      await dbSettingSetValue(db, key, value)

      // ACT
      const result = await dbSettingGetValue(db, key)

      // ASSERT
      expect(value).toBe(result)
    })

    it('should return null when setting does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingInputSet()

      // ACT
      const result = await dbSettingGetValue(db, key)

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

    it('should throw an error when getting a setting fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingInputSet()
      vi.spyOn(db.settings, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Setting>,
      )

      // ACT & ASSERT
      await expect(dbSettingGetValue(db, key)).rejects.toThrow(`Error getting setting with key ${key}`)
    })
  })
})
