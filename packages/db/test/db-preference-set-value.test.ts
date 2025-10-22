import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key'
import { dbPreferenceSetValue } from '../src/db-preference-set-value'
import { createDbTest, testPreferenceInputSet } from './test-helpers'

const db = createDbTest()

describe('db-preference-set-value', () => {
  beforeEach(async () => {
    await db.preferences.clear()
  })

  describe('expected behavior', () => {
    it('should create a preference when it does not exist', async () => {
      // ARRANGE
      expect.assertions(2)
      const [key, value] = testPreferenceInputSet()

      // ACT
      await dbPreferenceSetValue(db, key, value)

      // ASSERT
      const item = await dbPreferenceFindUniqueByKey(db, key)
      expect(item).toBeDefined()
      expect(item?.value).toBe(value)
    })

    it('should update a preference when it already exists', async () => {
      // ARRANGE
      expect.assertions(3)
      const [key, value] = testPreferenceInputSet()
      const updatedValue = 'updated-value'

      // Create initial preference
      await dbPreferenceSetValue(db, key, value)
      const initialItem = await dbPreferenceFindUniqueByKey(db, key)
      expect(initialItem?.value).toBe(value)

      // ACT
      await dbPreferenceSetValue(db, key, updatedValue)

      // ASSERT
      const updatedItem = await dbPreferenceFindUniqueByKey(db, key)
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
        dbPreferenceSetValue(db, 'invalid-key', 'test-value'),
      ).rejects.toThrow('Invalid preference key')
    })

    it('should throw an error with an empty value', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testPreferenceInputSet()

      // ACT & ASSERT
      await expect(dbPreferenceSetValue(db, key, '')).rejects.toThrow('Invalid preference value')
    })

    it('should throw an error with a non-string value', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key] = testPreferenceInputSet()

      // ACT & ASSERT
      await expect(
        // @ts-expect-error: Testing invalid input
        dbPreferenceSetValue(db, key, 123),
      ).rejects.toThrow('Invalid preference value')
    })

    it('should throw an error when creating a preference fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testPreferenceInputSet()
      vi.spyOn(db.preferences, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbPreferenceSetValue(db, key, value)).rejects.toThrow('Error creating preference')
    })

    it('should throw an error when updating a preference fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const [key, value] = testPreferenceInputSet()
      // Create initial preference
      await dbPreferenceSetValue(db, key, value)

      // Mock update to fail
      vi.spyOn(db.preferences, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(dbPreferenceSetValue(db, key, 'updated-value')).rejects.toThrow('Error updating preference')
    })
  })
})
