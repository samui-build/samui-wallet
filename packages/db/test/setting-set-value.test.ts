import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { settingFindUnique } from '../src/setting/setting-find-unique.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { createDbTest, testSettingSetInput } from './test-helpers.ts'

const db = createDbTest()

describe('setting-set-value', () => {
  beforeEach(async () => {
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should create a setting when it does not exist', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testSettingSetInput()

      // ACT
      await settingSetValue(db, key, value)

      // ASSERT
      const item = await settingFindUnique(db, key)
      expect(item).toBeDefined()
      expect(item?.value).toBe(value)
    })

    it('should update a setting when it already exists', async () => {
      // ARRANGE
      expect.assertions(3)
      const [key, value] = testSettingSetInput()
      const updatedValue = 'updated-value'

      // Create initial setting
      await settingSetValue(db, key, value)
      const initialItem = await settingFindUnique(db, key)
      expect(initialItem?.value).toBe(value)

      // ACT
      await settingSetValue(db, key, updatedValue)

      // ASSERT
      const updatedItem = await settingFindUnique(db, key)
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
        settingSetValue(db, 'invalid-key', 'test-value'),
      ).rejects.toThrow('Invalid setting key')
    })

    it('should throw an error with an empty value', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingSetInput()

      // ACT & ASSERT
      await expect(settingSetValue(db, key, '')).rejects.toThrow('Invalid setting value')
    })

    it('should throw an error with a non-string value', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingSetInput()

      // ACT & ASSERT
      await expect(
        // @ts-expect-error: Testing invalid input
        settingSetValue(db, key, 123),
      ).rejects.toThrow('Invalid setting value')
    })

    it('should throw an error when creating a setting fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingSetInput()
      vi.spyOn(db.settings, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(settingSetValue(db, key, value)).rejects.toThrow('Error creating setting')
    })

    it('should throw an error when updating a setting fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingSetInput()
      // Create initial setting
      await settingSetValue(db, key, value)

      // Mock update to fail
      vi.spyOn(db.settings, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(settingSetValue(db, key, 'updated-value')).rejects.toThrow('Error updating setting')
    })
  })
})
