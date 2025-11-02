import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbWalletCreate } from '../src/db-wallet-create.js'
import { dbWalletDelete } from '../src/db-wallet-delete.js'
import { dbWalletFindUnique } from '../src/db-wallet-find-unique.js'
import { createDbTest, testWalletInputCreate } from './test-helpers.js'

const db = createDbTest()

describe('db-wallet-delete', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should delete a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletInputCreate({ accountId: crypto.randomUUID() })
      const id = await dbWalletCreate(db, input)

      // ACT
      await dbWalletDelete(db, id)

      // ASSERT
      const deletedItem = await dbWalletFindUnique(db, id)
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

    it('should throw an error when deleting a wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.wallets, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(dbWalletDelete(db, id)).rejects.toThrow(`Error deleting wallet with id ${id}`)
    })
  })
})
