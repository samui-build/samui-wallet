import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Setting } from '../src/setting/setting.ts'
import { settingFindUnique } from '../src/setting/setting-find-unique.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { createDbContextTest, testSettingSetInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('setting-get-value', () => {
  beforeEach(async () => {
    await ctx.db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should get a setting value when it exists', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingSetInput()
      await settingSetValue(ctx, key, value)

      // ACT
      const result = (await settingFindUnique(ctx, key))?.value

      // ASSERT
      expect(value).toBe(result)
    })

    it('should return null when setting does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingSetInput()

      // ACT
      const result = (await settingFindUnique(ctx, key))?.value ?? null

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
      vi.spyOn(ctx.db.settings, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Setting>,
      )

      // ACT & ASSERT
      await expect(settingFindUnique(ctx, key)).rejects.toThrow(`Error finding setting with key ${key}`)
    })
  })
})
