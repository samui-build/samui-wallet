import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountCreateDetermineOrder } from '../src/account/account-create-determine-order.ts'
import type { AccountInternal } from '../src/account/account-internal.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { createDbContextTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('account-create-determine-order', () => {
  beforeEach(async () => {
    await ctx.db.accounts.clear()
    await ctx.db.settings.clear()
    await ctx.db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should determine the next account order for a wallet', async () => {
      // ARRANGE
      expect.assertions(3)
      const walletId1 = await walletCreate(ctx, testWalletCreateInput())
      const walletId2 = await walletCreate(ctx, testWalletCreateInput())

      // ACT
      const result1 = await accountCreateDetermineOrder(ctx, walletId1)
      await accountCreate(ctx, testAccountCreateInput({ walletId: walletId1 }))
      await accountCreate(ctx, testAccountCreateInput({ walletId: walletId1 }))
      await accountCreate(ctx, testAccountCreateInput({ walletId: walletId2 }))
      const result2 = await accountCreateDetermineOrder(ctx, walletId1)
      const result3 = await accountCreateDetermineOrder(ctx, walletId2)

      // ASSERT
      expect(result1).toBe(0)
      expect(result2).toBe(2)
      expect(result3).toBe(1)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding the last account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.spyOn(ctx.db.accounts, 'orderBy').mockImplementation(
        () =>
          ({
            and: () => ({
              last: () => Promise.reject(new Error('Test error')) as PromiseExtended<AccountInternal | undefined>,
            }),
          }) as never,
      )

      // ACT & ASSERT
      await expect(accountCreateDetermineOrder(ctx, 'wallet-id')).rejects.toThrow('Error finding last account')
    })
  })
})
