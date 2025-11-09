import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbWalletDelete } from '../src/db-wallet-delete.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletFindUnique } from '../src/wallet/wallet-find-unique.ts'
import { createDbTest, testWalletInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-wallet-delete', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should delete a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletInputCreate()
      const id = await walletCreate(db, input)

      // ACT
      await dbWalletDelete(db, id)

      // ASSERT
      const deletedItem = await walletFindUnique(db, id)
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
