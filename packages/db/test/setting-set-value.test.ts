import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { settingFindUnique } from '../src/setting/setting-find-unique.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { createDbContextTest, testSettingSetInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('setting-set-value', () => {
  beforeEach(async () => {
    await ctx.db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should create a setting when it does not exist', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testSettingSetInput()

      // ACT
      await settingSetValue(ctx, key, value)

      // ASSERT
      const item = await settingFindUnique(ctx, key)
      expect(item).toBeDefined()
      expect(item?.value).toBe(value)
    })

    it('should set vault settings', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      await settingSetValue(ctx, 'vaultKey', 'encrypted-vault-key')
      const result = await settingFindUnique(ctx, 'vaultKey')

      // ASSERT
      expect(result?.value).toBe('encrypted-vault-key')
    })

    it('should update a setting when it already exists', async () => {
      // ARRANGE
      expect.assertions(3)
      const [key, value] = testSettingSetInput()
      const updatedValue = 'updated-value'

      // Create initial setting
      await settingSetValue(ctx, key, value)
      const initialItem = await settingFindUnique(ctx, key)
      expect(initialItem?.value).toBe(value)

      // ACT
      await settingSetValue(ctx, key, updatedValue)

      // ASSERT
      const updatedItem = await settingFindUnique(ctx, key)
      expect(updatedItem).toBeDefined()
      expect(updatedItem?.value).toBe(updatedValue)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error with an invalid key', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(
        // @ts-expect-error: Testing invalid input
        settingSetValue(ctx, 'invalid-key', 'test-value'),
      ).rejects.toThrow('Invalid setting key')
    })

    it('should throw an error with an empty value', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingSetInput()

      // ACT & ASSERT
      await expect(settingSetValue(ctx, key, '')).rejects.toThrow('Invalid setting value')
    })

    it('should throw an error with a non-string value', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingSetInput()

      // ACT & ASSERT
      await expect(
        // @ts-expect-error: Testing invalid input
        settingSetValue(ctx, key, 123),
      ).rejects.toThrow('Invalid setting value')
    })

    it('should throw an error when creating a setting fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingSetInput()
      vi.spyOn(ctx.db.settings, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(settingSetValue(ctx, key, value)).rejects.toThrow('Error creating setting')
    })

    it('should throw an error when updating a setting fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingSetInput()
      // Create initial setting
      await settingSetValue(ctx, key, value)

      // Mock update to fail
      vi.spyOn(ctx.db.settings, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(settingSetValue(ctx, key, 'updated-value')).rejects.toThrow('Error updating setting')
    })
  })
})
