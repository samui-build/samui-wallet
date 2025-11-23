import { beforeEach, describe, expect, it } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountSetActive } from '../src/account/account-set-active.ts'
import { settingFindUniqueByKey } from '../src/setting/setting-find-unique-by-key.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('account-set-active', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.settings.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should set an account and its related wallet to active', async () => {
      // ARRANGE
      expect.assertions(4)
      const inputWallet1 = testWalletCreateInput()
      const inputWallet2 = testWalletCreateInput()
      const idWallet1 = await walletCreate(db, inputWallet1)
      const idWallet2 = await walletCreate(db, inputWallet2)

      const inputAccount1 = testAccountCreateInput({ walletId: idWallet1 })
      const inputAccount2 = testAccountCreateInput({ walletId: idWallet2 })
      const idAccount1 = await accountCreate(db, inputAccount1)
      const idAccount2 = await accountCreate(db, inputAccount2)

      // ACT
      const activeWalletIdBefore = await settingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdBefore = await settingFindUniqueByKey(db, 'activeAccountId')

      await accountSetActive(db, idAccount2)
      const activeWalletIdAfter = await settingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdAfter = await settingFindUniqueByKey(db, 'activeAccountId')

      // ASSERT
      expect(activeWalletIdBefore?.value).toBe(idWallet1)
      expect(activeAccountIdBefore?.value).toBe(idAccount1)
      expect(activeWalletIdAfter?.value).toBe(idWallet2)
      expect(activeAccountIdAfter?.value).toBe(idAccount2)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error when account does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const nonExistentId = 'non-existent-account-id'

      // ACT & ASSERT
      await expect(accountSetActive(db, nonExistentId)).rejects.toThrow(`Account with id ${nonExistentId} not found`)
    })
  })
})
