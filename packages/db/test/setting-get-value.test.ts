import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Setting } from '../src/setting/setting.ts'
import { settingGetValue } from '../src/setting/setting-get-value.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { createDbTest, testSettingSetInput } from './test-helpers.ts'

const db = createDbTest()

describe('setting-get-value', () => {
  beforeEach(async () => {
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should get a setting value when it exists', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingSetInput()
      await settingSetValue(db, key, value)

      // ACT
      const result = await settingGetValue(db, key)

      // ASSERT
      expect(value).toBe(result)
    })

    it('should return null when setting does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingSetInput()

      // ACT
      const result = await settingGetValue(db, key)

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
      const [key] = testSettingSetInput()
      vi.spyOn(db.settings, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Setting>,
      )

      // ACT & ASSERT
      await expect(settingGetValue(db, key)).rejects.toThrow(`Error getting setting with key ${key}`)
    })
  })
})
