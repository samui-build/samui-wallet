import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbPreferenceCreate } from '../src/db-preference-create'
import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key'
import { createDbTest, testPreferenceInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-preference-create', () => {
  beforeEach(async () => {
    await db.preferences.clear()
  })

  describe('expected behavior', () => {
    it('should create a preference', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testPreferenceInputCreate()

      // ACT
      await dbPreferenceCreate(db, input)

      // ASSERT
      const item = await dbPreferenceFindUniqueByKey(db, input.key)
      expect(item).toBeDefined()
      expect(item?.value).toBe(input.value)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when creating a preference fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testPreferenceInputCreate()
      vi.spyOn(db.preferences, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbPreferenceCreate(db, input)).rejects.toThrow('Error creating preference')
    })

    it('should throw an error with an invalid key', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testPreferenceInputCreate({
        // @ts-expect-error: Testing invalid input
        key: 'invalid-key',
      })

      // ACT & ASSERT
      await expect(dbPreferenceCreate(db, input)).rejects.toThrow()
    })

    it('should throw an error when creating a preference with a key that already exists', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testPreferenceInputCreate()
      // Create the first preference
      await dbPreferenceCreate(db, input)

      // ACT & ASSERT
      // Attempt to create a second preference with the same key
      await expect(dbPreferenceCreate(db, { ...input, value: 'test-cluster-id-2' })).rejects.toThrow(
        'Error creating preference',
      )
    })
  })
})
