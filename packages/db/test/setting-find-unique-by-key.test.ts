import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Setting } from '../src/setting/setting.ts'
import { settingFindUniqueByKey } from '../src/setting/setting-find-unique-by-key.ts'
import type { SettingKey } from '../src/setting/setting-key.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { createDbTest, testSettingSetInput } from './test-helpers.ts'

const db = createDbTest()

describe('setting-find-unique-by-key', () => {
  beforeEach(async () => {
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique setting', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testSettingSetInput()
      await settingSetValue(db, key, value)

      // ACT
      const result = await settingFindUniqueByKey(db, key)

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
      await expect(settingFindUniqueByKey(db, key)).rejects.toThrow(`Error finding setting with key ${key}`)
    })
  })
})
