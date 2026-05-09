import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import type { AccountInternal } from '../src/account/account-internal.ts'
import { accountReadSecretKey } from '../src/account/account-read-secret-key.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import {
  createDbContextTest,
  createPasswordTestVault,
  testAccountCreateInput,
  testWalletCreateInput,
} from './test-helpers.ts'

const ctx = createDbContextTest()

describe('account-read-secret-key', () => {
  beforeEach(async () => {
    await ctx.db.accounts.clear()
    await ctx.db.wallets.clear()
    await createPasswordTestVault(ctx)
  })

  describe('expected behavior', () => {
    it('should read the secret key of an account', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletInput = testWalletCreateInput()
      const walletId = await walletCreate(ctx, walletInput)
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const id = await accountCreate(ctx, accountInput)

      // ACT
      const result = await accountReadSecretKey(ctx, id)

      // ASSERT
      expect(result).toBe(accountInput.secretKey)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error if the account is not found', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'non-existent-id'

      // ACT & ASSERT
      await expect(accountReadSecretKey(ctx, id)).rejects.toThrow(`Account with id ${id} not found`)
    })

    it('should throw when reading a secret key while the vault is locked', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = await walletCreate(ctx, testWalletCreateInput())
      const accountInput = testAccountCreateInput({ secretKey: 'test-secret-key', walletId })
      const id = await accountCreate(ctx, accountInput)
      ctx.vault.lock()

      // ACT & ASSERT
      await expect(accountReadSecretKey(ctx, id)).rejects.toThrow('Vault is locked')
    })

    it('should throw an error if the account is of type Watched', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletInput = testWalletCreateInput()
      const walletId = await walletCreate(ctx, walletInput)
      const accountInput = testAccountCreateInput({ type: 'Watched', walletId })
      const id = await accountCreate(ctx, accountInput)

      // ACT & ASSERT
      await expect(accountReadSecretKey(ctx, id)).rejects.toThrow(`Account with id ${id} does not have a secret key`)
    })

    it('should throw an error when reading the secret key fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(ctx.db.accounts, 'where').mockImplementationOnce(
        () =>
          ({
            equals: () => ({
              raw: () => ({
                first: () => Promise.reject(new Error('Test error')) as PromiseExtended<AccountInternal | undefined>,
              }),
            }),
          }) as never,
      )

      // ACT & ASSERT
      await expect(accountReadSecretKey(ctx, id)).rejects.toThrow(`Error finding account with id ${id}`)
    })
  })
})
