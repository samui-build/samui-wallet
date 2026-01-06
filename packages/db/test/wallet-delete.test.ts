import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletDelete } from '../src/wallet/wallet-delete.ts'
import { walletFindUnique } from '../src/wallet/wallet-find-unique.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('wallet-delete', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.settings.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should delete a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      // We create the first wallet so that will be the default. The second is the one that will be deleted.
      const first = await walletCreate(db, testWalletCreateInput())
      await accountCreate(db, testAccountCreateInput({ walletId: first }))
      const input = testWalletCreateInput()
      const id = await walletCreate(db, input)

      // ACT
      await walletDelete(db, id)

      // ASSERT
      const deletedItem = await walletFindUnique(db, id)
      expect(deletedItem).toBeNull()
    })

    it('should delete the accounts in a wallet', async () => {
      // ARRANGE
      expect.assertions(2)
      // We create the first wallet so that will be the default. The second is the one that will be deleted.
      const first = await walletCreate(db, testWalletCreateInput())
      await accountCreate(db, testAccountCreateInput({ walletId: first }))
      const input = testWalletCreateInput()
      const id = await walletCreate(db, input)
      const accountId = await accountCreate(db, testAccountCreateInput({ walletId: id }))

      // ACT
      await walletDelete(db, id)

      // ASSERT
      const deletedWallet = await walletFindUnique(db, id)
      const deletedAccount = await accountFindUnique(db, accountId)
      expect(deletedWallet).toBeNull()
      expect(deletedAccount).toBeNull()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should not delete an active wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput()
      const id = await walletCreate(db, input)
      await accountCreate(db, testAccountCreateInput({ walletId: id }))

      // ACT & ASSERT
      await expect(walletDelete(db, id)).rejects.toThrow(
        'You cannot delete the active wallet. Please change wallets and try again.',
      )
    })

    it('should throw an error when deleting a wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const first = await walletCreate(db, testWalletCreateInput())
      await accountCreate(db, testAccountCreateInput({ walletId: first }))
      const id = await walletCreate(db, testWalletCreateInput())
      // const id = 'test-id'
      vi.spyOn(db.wallets, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(walletDelete(db, id)).rejects.toThrow(`Error deleting wallet with id ${id}`)
    })
  })
})
