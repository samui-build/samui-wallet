import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { DbAccountCreateInput } from '../src/db-account-create'

import { dbAccountCreate } from '../src/db-account-create'
import { dbAccountDelete } from '../src/db-account-delete'
import { dbAccountFindUnique } from '../src/db-account-find-unique'
import { createDbTest, randomName } from './test-helpers'

const db = createDbTest()

describe('db-account-delete', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should delete an account', async () => {
      // ARRANGE
      expect.assertions(1)
      const input: DbAccountCreateInput = { mnemonic: 'baz', name: randomName('account'), secret: 'bar' }
      const id = await dbAccountCreate(db, input)

      // ACT
      await dbAccountDelete(db, id)

      // ASSERT
      const deletedItem = await dbAccountFindUnique(db, id)
      expect(deletedItem).toBeUndefined()
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
