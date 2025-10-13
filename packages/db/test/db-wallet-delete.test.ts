import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { WalletInputCreate } from '../src/dto/wallet-input-create'

import { dbWalletCreate } from '../src/db-wallet-create'
import { dbWalletDelete } from '../src/db-wallet-delete'
import { dbWalletFindUnique } from '../src/db-wallet-find-unique'
import { createDbTest, randomName } from './test-helpers'

const db = createDbTest()

describe('db-wallet-delete', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should delete a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const input: WalletInputCreate = {
        accountId: crypto.randomUUID(),
        name: randomName('wallet'),
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
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
