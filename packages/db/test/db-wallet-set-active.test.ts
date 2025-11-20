import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { dbWalletCreate } from '../src/db-wallet-create.ts'
import { dbWalletSetActive } from '../src/db-wallet-set-active.ts'
import { settingFindUniqueByKey } from '../src/setting/setting-find-unique-by-key.ts'
import { createDbTest, testAccountCreateInput, testWalletInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-wallet-set-active', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.settings.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should set a wallet and its first account to active', async () => {
      // ARRANGE
      expect.assertions(4)
      const inputWallet1 = testWalletInputCreate()
      const inputWallet2 = testWalletInputCreate()
      const idWallet1 = await dbWalletCreate(db, inputWallet1)
      const idWallet2 = await dbWalletCreate(db, inputWallet2)

      const inputAccount1 = testAccountCreateInput({ walletId: idWallet1 })
      const inputAccount2 = testAccountCreateInput({ walletId: idWallet2 })
      const idAccount1 = await accountCreate(db, inputAccount1)
      const idAccount2 = await accountCreate(db, inputAccount2)

      // ACT
      const activeWalletIdBeforeSetActive = await settingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdBeforeSetActive = await settingFindUniqueByKey(db, 'activeAccountId')

      await dbWalletSetActive(db, idWallet2)
      const activeWalletIdAfterSetActive = await settingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdAfterSetActive = await settingFindUniqueByKey(db, 'activeAccountId')

      // ASSERT
      expect(activeWalletIdBeforeSetActive?.value).toBe(idWallet1)
      expect(activeAccountIdBeforeSetActive?.value).toBe(idAccount1)
      expect(activeWalletIdAfterSetActive?.value).toBe(idWallet2)
      expect(activeAccountIdAfterSetActive?.value).toBe(idAccount2)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when wallet does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const nonExistentId = 'non-existent-wallet-id'

      // ACT & ASSERT
      await expect(dbWalletSetActive(db, nonExistentId)).rejects.toThrow(`Wallet with id ${nonExistentId} not found`)
    })

    it('should handle wallet with no accounts gracefully', async () => {
      // ARRANGE
      expect.assertions(3)
      const inputWallet = testWalletInputCreate()
      const idWallet = await dbWalletCreate(db, inputWallet)

      // ACT
      await dbWalletSetActive(db, idWallet)
      const activeWalletIdAfterSetActive = await settingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdAfterSetActive = await settingFindUniqueByKey(db, 'activeAccountId')

      // ASSERT
      expect(activeWalletIdAfterSetActive?.value).toBe(idWallet)
      expect(activeAccountIdAfterSetActive?.value).toBeUndefined()
      expect(console.warn).toHaveBeenCalledWith(`There are no accounts in wallet ${idWallet}`)
    })
  })
})
