import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbAccountCreate } from '../src/db-account-create.ts'
import { dbAccountDelete } from '../src/db-account-delete.ts'
import { dbAccountFindUnique } from '../src/db-account-find-unique.ts'
import { createDbTest, testAccountInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-account-delete', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should delete an account', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testAccountInputCreate({ walletId: crypto.randomUUID() })
      const id = await dbAccountCreate(db, input)

      // ACT
      await dbAccountDelete(db, id)

      // ASSERT
      const deletedItem = await dbAccountFindUnique(db, id)
      expect(deletedItem).toBeNull()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when deleting an account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.accounts, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(dbAccountDelete(db, id)).rejects.toThrow(`Error deleting account with id ${id}`)
    })
  })
})
