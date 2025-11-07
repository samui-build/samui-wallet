import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbSettingFindUniqueByKey } from '../src/db-setting-find-unique-by-key.ts'
import { dbSettingSetValue } from '../src/db-setting-set-value.ts'
import { createDbTest, testSettingInputSet } from './test-helpers.ts'

const db = createDbTest()

describe('db-setting-set-value', () => {
  beforeEach(async () => {
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should create a setting when it does not exist', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testSettingInputSet()

      // ACT
      await dbSettingSetValue(db, key, value)

      // ASSERT
      const item = await dbSettingFindUniqueByKey(db, key)
      expect(item).toBeDefined()
      expect(item?.value).toBe(value)
    })

    it('should update a setting when it already exists', async () => {
      // ARRANGE
      expect.assertions(3)
      const [key, value] = testSettingInputSet()
      const updatedValue = 'updated-value'

      // Create initial setting
      await dbSettingSetValue(db, key, value)
      const initialItem = await dbSettingFindUniqueByKey(db, key)
      expect(initialItem?.value).toBe(value)

      // ACT
      await dbSettingSetValue(db, key, updatedValue)

      // ASSERT
      const updatedItem = await dbSettingFindUniqueByKey(db, key)
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
        dbSettingSetValue(db, 'invalid-key', 'test-value'),
      ).rejects.toThrow('Invalid setting key')
    })

    it('should throw an error with an empty value', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingInputSet()

      // ACT & ASSERT
      await expect(dbSettingSetValue(db, key, '')).rejects.toThrow('Invalid setting value')
    })

    it('should throw an error with a non-string value', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testSettingInputSet()

      // ACT & ASSERT
      await expect(
        // @ts-expect-error: Testing invalid input
        dbSettingSetValue(db, key, 123),
      ).rejects.toThrow('Invalid setting value')
    })

    it('should throw an error when creating a setting fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingInputSet()
      vi.spyOn(db.settings, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbSettingSetValue(db, key, value)).rejects.toThrow('Error creating setting')
    })

    it('should throw an error when updating a setting fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testSettingInputSet()
      // Create initial setting
      await dbSettingSetValue(db, key, value)

      // Mock update to fail
      vi.spyOn(db.settings, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(dbSettingSetValue(db, key, 'updated-value')).rejects.toThrow('Error updating setting')
    })
  })
})
