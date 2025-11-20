import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { settingFindUniqueByKey } from '../src/setting/setting-find-unique-by-key.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletSetActive } from '../src/wallet/wallet-set-active.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('wallet-set-active', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.settings.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should set a wallet and its first account to active', async () => {
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
      const activeWalletIdBeforeSetActive = await settingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdBeforeSetActive = await settingFindUniqueByKey(db, 'activeAccountId')

      await walletSetActive(db, idWallet2)
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
      await expect(walletSetActive(db, nonExistentId)).rejects.toThrow(`Wallet with id ${nonExistentId} not found`)
    })

    it('should handle wallet with no accounts gracefully', async () => {
      // ARRANGE
      expect.assertions(3)
      const inputWallet = testWalletCreateInput()
      const idWallet = await walletCreate(db, inputWallet)

      // ACT
      await walletSetActive(db, idWallet)
      const activeWalletIdAfterSetActive = await settingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdAfterSetActive = await settingFindUniqueByKey(db, 'activeAccountId')

      // ASSERT
      expect(activeWalletIdAfterSetActive?.value).toBe(idWallet)
      expect(activeAccountIdAfterSetActive?.value).toBeUndefined()
      expect(console.warn).toHaveBeenCalledWith(`There are no accounts in wallet ${idWallet}`)
    })
  })
})
