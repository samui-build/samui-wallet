import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletDelete } from '../src/wallet/wallet-delete.ts'
import { walletFindUnique } from '../src/wallet/wallet-find-unique.ts'
import { createDbContextTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('wallet-delete', () => {
  beforeEach(async () => {
    await ctx.db.accounts.clear()
    await ctx.db.settings.clear()
    await ctx.db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should delete a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      // We create the first wallet so that will be the default. The second is the one that will be deleted.
      const first = await walletCreate(ctx, testWalletCreateInput())
      await accountCreate(ctx, testAccountCreateInput({ walletId: first }))
      const input = testWalletCreateInput()
      const id = await walletCreate(ctx, input)

      // ACT
      await walletDelete(ctx, id)

      // ASSERT
      const deletedItem = await walletFindUnique(ctx, id)
      expect(deletedItem).toBeNull()
    })

    it('should delete the accounts in a wallet', async () => {
      // ARRANGE
      expect.assertions(2)
      // We create the first wallet so that will be the default. The second is the one that will be deleted.
      const first = await walletCreate(ctx, testWalletCreateInput())
      await accountCreate(ctx, testAccountCreateInput({ walletId: first }))
      const input = testWalletCreateInput()
      const id = await walletCreate(ctx, input)
      const accountId = await accountCreate(ctx, testAccountCreateInput({ walletId: id }))

      // ACT
      await walletDelete(ctx, id)

      // ASSERT
      const deletedWallet = await walletFindUnique(ctx, id)
      const deletedAccount = await accountFindUnique(ctx, accountId)
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
      const id = await walletCreate(ctx, input)
      await accountCreate(ctx, testAccountCreateInput({ walletId: id }))

      // ACT & ASSERT
      await expect(walletDelete(ctx, id)).rejects.toThrow(
        'You cannot delete the active wallet. Please change wallets and try again.',
      )
    })

    it('should throw an error when deleting a wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const first = await walletCreate(ctx, testWalletCreateInput())
      await accountCreate(ctx, testAccountCreateInput({ walletId: first }))
      const id = await walletCreate(ctx, testWalletCreateInput())
      // const id = 'test-id'
      vi.spyOn(ctx.db.wallets, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(walletDelete(ctx, id)).rejects.toThrow(`Error deleting wallet with id ${id}`)
    })
  })
})
