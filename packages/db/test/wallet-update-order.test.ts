import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Wallet } from '../src/wallet/wallet.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletFindMany } from '../src/wallet/wallet-find-many.ts'
import { walletUpdateOrder } from '../src/wallet/wallet-update-order.ts'
import { createDbContextTest, testWalletCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('walletUpdateOrder', () => {
  beforeEach(async () => {
    await ctx.db.wallets.clear()
  })

  describe('expected behavior', () => {
    let wallet1: Wallet, wallet2: Wallet, wallet3: Wallet, wallet4: Wallet

    beforeEach(async () => {
      await Promise.all([
        walletCreate(ctx, testWalletCreateInput({ name: 'Wallet 1' })),
        walletCreate(ctx, testWalletCreateInput({ name: 'Wallet 2' })),
        walletCreate(ctx, testWalletCreateInput({ name: 'Wallet 3' })),
        walletCreate(ctx, testWalletCreateInput({ name: 'Wallet 4' })),
      ])
      const wallets = await walletFindMany(ctx)
      wallet1 = wallets.find((w) => w.name === 'Wallet 1') as Wallet
      wallet2 = wallets.find((w) => w.name === 'Wallet 2') as Wallet
      wallet3 = wallets.find((w) => w.name === 'Wallet 3') as Wallet
      wallet4 = wallets.find((w) => w.name === 'Wallet 4') as Wallet
    })

    it('should move a wallet to a lower order', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await walletUpdateOrder(ctx, { id: wallet4.id, order: 1 })
      const result = await walletFindMany(ctx)

      // ASSERT
      expect(result.find((w) => w.id === wallet1.id)?.order).toBe(0)
      expect(result.find((w) => w.id === wallet4.id)?.order).toBe(1)
      expect(result.find((w) => w.id === wallet2.id)?.order).toBe(2)
      expect(result.find((w) => w.id === wallet3.id)?.order).toBe(3)
    })

    it('should move a wallet to a higher order', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await walletUpdateOrder(ctx, { id: wallet1.id, order: 3 })
      const result = await walletFindMany(ctx)

      // ASSERT
      expect(result.find((w) => w.id === wallet2.id)?.order).toBe(0)
      expect(result.find((w) => w.id === wallet3.id)?.order).toBe(1)
      expect(result.find((w) => w.id === wallet4.id)?.order).toBe(2)
      expect(result.find((w) => w.id === wallet1.id)?.order).toBe(3)
    })

    it('should not change order if moving to the same position', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await walletUpdateOrder(ctx, { id: wallet2.id, order: 1 })
      const result = await walletFindMany(ctx)

      // ASSERT
      expect(result.find((w) => w.id === wallet1.id)?.order).toBe(0)
      expect(result.find((w) => w.id === wallet2.id)?.order).toBe(1)
      expect(result.find((w) => w.id === wallet3.id)?.order).toBe(2)
      expect(result.find((w) => w.id === wallet4.id)?.order).toBe(3)
    })

    it('should clamp order if out of bounds (lower)', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await walletUpdateOrder(ctx, { id: wallet3.id, order: -100 })
      const result = await walletFindMany(ctx)

      // ASSERT
      expect(result.find((w) => w.id === wallet3.id)?.order).toBe(0)
      expect(result.find((w) => w.id === wallet1.id)?.order).toBe(1)
      expect(result.find((w) => w.id === wallet2.id)?.order).toBe(2)
      expect(result.find((w) => w.id === wallet4.id)?.order).toBe(3)
    })

    it('should clamp order if out of bounds (higher)', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await walletUpdateOrder(ctx, { id: wallet2.id, order: 100 })
      const result = await walletFindMany(ctx)

      // ASSERT
      expect(result.find((w) => w.id === wallet1.id)?.order).toBe(0)
      expect(result.find((w) => w.id === wallet3.id)?.order).toBe(1)
      expect(result.find((w) => w.id === wallet4.id)?.order).toBe(2)
      expect(result.find((w) => w.id === wallet2.id)?.order).toBe(3)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when wallet is not found', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(walletUpdateOrder(ctx, { id: 'non-existent', order: 0 })).rejects.toThrow(
        'Wallet with id non-existent not found',
      )
    })
  })
})
