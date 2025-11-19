import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { accountCreate } from '../src/account/account-create.ts'
import { accountDelete } from '../src/account/account-delete.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { createDbTest, testAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('account-delete', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should delete an account', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testAccountCreateInput({ walletId: crypto.randomUUID() })
      const id = await accountCreate(db, input)

      // ACT
      await accountDelete(db, id)

      // ASSERT
      const deletedItem = await accountFindUnique(db, id)
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
      await expect(accountDelete(db, id)).rejects.toThrow(`Error deleting account with id ${id}`)
    })
  })
})
