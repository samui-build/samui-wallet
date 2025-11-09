import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbAccountCreate } from '../src/db-account-create.ts'
import { dbAccountFindUnique } from '../src/db-account-find-unique.ts'
import { dbAccountUpdate } from '../src/db-account-update.ts'
import { createDbTest, randomName, testAccountInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-account-update', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should update an account', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testAccountInputCreate({ name: randomName('account'), walletId: crypto.randomUUID() })
      const id = await dbAccountCreate(db, input)
      const newName = randomName('newName')

      // ACT
      await dbAccountUpdate(db, id, { name: newName })

      // ASSERT
      const updatedItem = await dbAccountFindUnique(db, id)
      expect(updatedItem).toBeDefined()
      expect(updatedItem?.name).toBe(newName)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when updating an account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.accounts, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(dbAccountUpdate(db, id, {})).rejects.toThrow(`Error updating account with id ${id}`)
    })
  })
})
