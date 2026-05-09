import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import type { WalletInternal } from '../src/wallet/wallet-internal.ts'
import { walletReadMnemonic } from '../src/wallet/wallet-read-mnemonic.ts'
import { createDbContextTest, createPasswordTestVault, testWalletCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('wallet-read-mnemonic', () => {
  beforeEach(async () => {
    await ctx.db.wallets.clear()
    await createPasswordTestVault(ctx)
  })

  describe('expected behavior', () => {
    it('should read the mnemonic of a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput()
      const id = await walletCreate(ctx, input)

      // ACT
      const result = await walletReadMnemonic(ctx, id)

      // ASSERT
      expect(result).toBe(input.mnemonic)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error if the wallet is not found', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'non-existent-id'

      // ACT & ASSERT
      await expect(walletReadMnemonic(ctx, id)).rejects.toThrow(`Wallet with id ${id} not found`)
    })

    it('should throw when reading a password wallet while the vault is locked', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput()
      const id = await walletCreate(ctx, input)
      ctx.vault.lock()

      // ACT & ASSERT
      await expect(walletReadMnemonic(ctx, id)).rejects.toThrow('Vault is locked')
    })

    it('should throw an error when reading the mnemonic fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(ctx.db.wallets, 'where').mockImplementationOnce(
        () =>
          ({
            equals: () => ({
              raw: () => ({
                first: () => Promise.reject(new Error('Test error')) as PromiseExtended<WalletInternal | undefined>,
              }),
            }),
          }) as never,
      )

      // ACT & ASSERT
      await expect(walletReadMnemonic(ctx, id)).rejects.toThrow(`Error finding wallet with id ${id}`)
    })
  })
})
