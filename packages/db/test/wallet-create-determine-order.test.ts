import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletCreateDetermineOrder } from '../src/wallet/wallet-create-determine-order.ts'
import type { WalletInternal } from '../src/wallet/wallet-internal.ts'
import { createAppContextTest, testWalletCreateInput } from './test-helpers.ts'

const ctx = createAppContextTest()

describe('wallet-create-determine-order', () => {
  beforeEach(async () => {
    await ctx.db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should determine the next wallet order', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      const result1 = await walletCreateDetermineOrder(ctx)
      await walletCreate(ctx, testWalletCreateInput())
      await walletCreate(ctx, testWalletCreateInput())
      const result2 = await walletCreateDetermineOrder(ctx)

      // ASSERT
      expect(result1).toBe(0)
      expect(result2).toBe(2)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding the last wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.spyOn(ctx.db.wallets, 'orderBy').mockImplementation(
        () =>
          ({
            last: () => Promise.reject(new Error('Test error')) as PromiseExtended<WalletInternal | undefined>,
          }) as never,
      )

      // ACT & ASSERT
      await expect(walletCreateDetermineOrder(ctx)).rejects.toThrow('Error finding last wallet')
    })
  })
})
