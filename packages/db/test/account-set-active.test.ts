import { beforeEach, describe, expect, it } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountSetActive } from '../src/account/account-set-active.ts'
import { settingFindUnique } from '../src/setting/setting-find-unique.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { createDbContextTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('account-set-active', () => {
  beforeEach(async () => {
    await ctx.db.accounts.clear()
    await ctx.db.settings.clear()
    await ctx.db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should set an account and its related wallet to active', async () => {
      // ARRANGE
      expect.assertions(2)
      const inputWallet1 = testWalletCreateInput()
      const inputWallet2 = testWalletCreateInput()
      const idWallet1 = await walletCreate(ctx, inputWallet1)
      const idWallet2 = await walletCreate(ctx, inputWallet2)

      const inputAccount1 = testAccountCreateInput({ walletId: idWallet1 })
      const inputAccount2 = testAccountCreateInput({ walletId: idWallet2 })
      const idAccount1 = await accountCreate(ctx, inputAccount1)
      const idAccount2 = await accountCreate(ctx, inputAccount2)

      // ACT
      const activeAccountIdBefore = await settingFindUnique(ctx, 'activeAccountId')

      await accountSetActive(ctx, idAccount2)
      const activeAccountIdAfter = await settingFindUnique(ctx, 'activeAccountId')

      // ASSERT
      expect(activeAccountIdBefore?.value).toBe(idAccount1)
      expect(activeAccountIdAfter?.value).toBe(idAccount2)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error when account does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const nonExistentId = 'non-existent-account-id'

      // ACT & ASSERT
      await expect(accountSetActive(ctx, nonExistentId)).rejects.toThrow(`Account with id ${nonExistentId} not found`)
    })
  })
})
