import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Setting } from '../src/setting/setting.ts'
import { settingFindMany } from '../src/setting/setting-find-many.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { createDbTest, testSettingSetInput } from './test-helpers.ts'

const db = createDbTest()

describe('setting-find-many', () => {
  beforeEach(async () => {
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should find many settings by key', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testSettingSetInput()
      await settingSetValue(db, key, value)
      await settingSetValue(db, 'apiEndpoint', 'https://api.samui.build')

      // ACT
      const result = await settingFindMany(db, { key })

      // ASSERT
      expect(result).toHaveLength(1)
      expect(result[0]?.value).toBe(value)
    })

    it('should find many settings by value', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testSettingSetInput()
      await settingSetValue(db, key, value)
      await settingSetValue(db, 'apiEndpoint', 'https://api.samui.build')

      // ACT
      const result = await settingFindMany(db, { value })

      // ASSERT
      expect(result).toHaveLength(1)
      expect(result[0]?.key).toBe(key)
    })

    it('should find many settings by value and key', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testSettingSetInput()
      await settingSetValue(db, key, value)
      await settingSetValue(db, 'apiEndpoint', 'https://api.samui.build')

      // ACT
      const result = await settingFindMany(db, { key, value })

      // ASSERT
      expect(result).toHaveLength(1)
      expect(result[0]?.key).toBe(key)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding settings fails', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.spyOn(db.settings, 'orderBy').mockImplementation(
        () =>
          ({
            filter: () => ({
              toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Setting[]>,
            }),
          }) as never,
      )

      // ACT & ASSERT
      await expect(settingFindMany(db)).rejects.toThrow('Error finding settings')
    })
  })
})
