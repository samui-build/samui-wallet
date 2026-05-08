import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { reset } from '../src/reset.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { createDbContextTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('reset', () => {
  beforeEach(async () => {
    await Promise.all(ctx.db.tables.map((table) => table.clear()))
  })

  describe('expected behavior', () => {
    it('should clear tables and populate default records', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = await walletCreate(ctx, testWalletCreateInput())
      await accountCreate(ctx, testAccountCreateInput({ walletId }))

      // ACT
      await reset(ctx)
      const result = {
        accounts: await ctx.db.accounts.count(),
        bookmarkAccounts: await ctx.db.bookmarkAccounts.count(),
        bookmarkTransactions: await ctx.db.bookmarkTransactions.count(),
        networks: await ctx.db.networks.count(),
        settings: await ctx.db.settings.count(),
        wallets: await ctx.db.wallets.count(),
      }

      // ASSERT
      expect(result).toEqual({
        accounts: 0,
        bookmarkAccounts: 0,
        bookmarkTransactions: 0,
        networks: 3,
        settings: 2,
        wallets: 0,
      })
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should populate default records when tables are already empty', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      await reset(ctx)
      const result1 = await ctx.db.networks.count()
      const result2 = await ctx.db.settings.count()

      // ASSERT
      expect(result1).toBe(3)
      expect(result2).toBe(2)
    })
  })
})
