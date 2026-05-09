import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Account } from '../src/account/account.ts'
import { accountCreate } from '../src/account/account-create.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import {
  createDbContextTest,
  createPasswordTestVault,
  testAccountCreateInput,
  testWalletCreateInput,
} from './test-helpers.ts'

const ctx = createDbContextTest()

describe('account-find-unique', () => {
  beforeEach(async () => {
    await ctx.db.accounts.clear()
    await ctx.db.wallets.clear()
    await createPasswordTestVault(ctx)
  })

  describe('expected behavior', () => {
    it('should find a unique account', async () => {
      // ARRANGE
      expect.assertions(3)
      const walletId = await walletCreate(ctx, testWalletCreateInput())
      const input = testAccountCreateInput({ walletId })
      const id = await accountCreate(ctx, input)

      // ACT
      const item = await accountFindUnique(ctx, id)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.name).toBe(input.name)
      // @ts-expect-error secretKey does not exist on the type. Here we ensure it's sanitized.
      expect(item?.secretKey).toBe(undefined)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding a unique account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(ctx.db.accounts, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<undefined | Account>,
      )

      // ACT & ASSERT
      await expect(accountFindUnique(ctx, id)).rejects.toThrow(`Error finding account with id ${id}`)
    })
  })
})
