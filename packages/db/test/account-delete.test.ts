import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountDelete } from '../src/account/account-delete.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { settingSetValue } from '../src/setting/setting-set-value.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import {
  createDbContextTest,
  createPasswordTestVault,
  testAccountCreateInput,
  testSettingSetInput,
  testWalletCreateInput,
} from './test-helpers.ts'

const ctx = createDbContextTest()

describe('account-delete', () => {
  beforeEach(async () => {
    await ctx.db.accounts.clear()
    await ctx.db.wallets.clear()
    await createPasswordTestVault(ctx)
  })

  describe('expected behavior', () => {
    it('should delete an account', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId1 = await walletCreate(ctx, testWalletCreateInput())
      const walletId2 = await walletCreate(ctx, testWalletCreateInput())
      await accountCreate(ctx, testAccountCreateInput({ walletId: walletId1 }))
      const input = testAccountCreateInput({ walletId: walletId2 })
      const id = await accountCreate(ctx, input)

      // ACT
      await accountDelete(ctx, id)

      // ASSERT
      const deletedItem = await accountFindUnique(ctx, id)
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

    it('should not delete an active account', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = await walletCreate(ctx, testWalletCreateInput())
      const input = testAccountCreateInput({ walletId })
      const id = await accountCreate(ctx, input)
      const [_, value] = testSettingSetInput(id)

      await settingSetValue(ctx, 'activeAccountId', value)

      // ACT & ASSERT
      await expect(accountDelete(ctx, id)).rejects.toThrow(
        'You cannot delete the active account. Please change accounts and try again.',
      )
    })

    it('should throw an error when deleting an account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(ctx.db.accounts, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(accountDelete(ctx, id)).rejects.toThrow(`Error deleting account with id ${id}`)
    })
  })
})
