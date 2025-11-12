import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbSettingFindUniqueByKey } from '../src/db-setting-find-unique-by-key.ts'
import { dbSettingSetValue } from '../src/db-setting-set-value.ts'
import type { Setting } from '../src/entity/setting.ts'
import type { SettingKey } from '../src/entity/setting-key.ts'
import { createDbTest, testSettingInputSet } from './test-helpers.ts'

const db = createDbTest()

describe('db-setting-find-unique-by-key', () => {
  beforeEach(async () => {
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique setting', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testSettingInputSet()
      await dbSettingSetValue(db, key, value)

      // ACT
      const result = await dbSettingFindUniqueByKey(db, key)

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

    it('should throw an error when finding a unique setting fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const key: SettingKey = 'activeNetworkId'
      vi.spyOn(db.settings, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Setting | undefined>,
      )

      // ACT & ASSERT
      await expect(dbSettingFindUniqueByKey(db, key)).rejects.toThrow(`Error finding setting with key ${key}`)
    })
  })
})
