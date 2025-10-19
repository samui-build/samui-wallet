import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { PreferenceInputUpdate } from '../src/dto/preference-input-update'

import { dbPreferenceCreate } from '../src/db-preference-create'
import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key'
import { dbPreferenceUpdateByKey } from '../src/db-preference-update-by-key'
import { createDbTest, testPreferenceInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-preference-update-by-key', () => {
  const initialInput = testPreferenceInputCreate()

  beforeEach(async () => {
    await db.preferences.clear()
    // Create a preference to be updated in tests
    await dbPreferenceCreate(db, initialInput)
  })

  describe('expected behavior', () => {
    it('should update a preference', async () => {
      // ARRANGE
      expect.assertions(3)
      const update: PreferenceInputUpdate = { value: 'test-cluster-id-2' }
      const original = await dbPreferenceFindUniqueByKey(db, initialInput.key)
      expect(original?.value).toBe(initialInput.value)

      // ACT
      await dbPreferenceUpdateByKey(db, initialInput.key, update)

      // ASSERT
      const updated = await dbPreferenceFindUniqueByKey(db, initialInput.key)
      expect(updated?.value).toBe(update.value)
      expect(updated?.updatedAt).not.toEqual(original?.updatedAt)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when updating a preference fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const update: PreferenceInputUpdate = { value: 'test-cluster-id-2' }
      vi.spyOn(db.preferences, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(dbPreferenceUpdateByKey(db, initialInput.key, update)).rejects.toThrow(
        `Error updating preference with key ${initialInput.key}`,
      )
    })

    it('should throw an error when trying to update a non-existent preference', async () => {
      // ARRANGE
      expect.assertions(1)
      const update: PreferenceInputUpdate = { value: 'some-value' }
      // Using a key that is valid but not in the DB for this test
      const nonExistentKey = 'activeClusterId'
      await db.preferences.clear() // Ensure the key does not exist

      // ACT & ASSERT
      await expect(dbPreferenceUpdateByKey(db, nonExistentKey, update)).rejects.toThrow(
        `Error updating preference with key ${nonExistentKey}: not found`,
      )
    })

    it('should throw an error with invalid input', async () => {
      // ARRANGE
      expect.assertions(1)
      const invalidUpdate: PreferenceInputUpdate = {
        // @ts-expect-error: Testing invalid input
        invalidField: 'invalid-value',
      }

      // ACT & ASSERT
      await expect(dbPreferenceUpdateByKey(db, initialInput.key, invalidUpdate)).rejects.toThrow()
    })
  })
})
