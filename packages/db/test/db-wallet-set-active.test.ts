import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbAccountCreate } from '../src/db-account-create.ts'
import { dbSettingFindUniqueByKey } from '../src/db-setting-find-unique-by-key.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletSetActive } from '../src/wallet/wallet-set-active.ts'
import { createDbTest, testAccountInputCreate, testWalletInputCreate } from './test-helpers.ts'

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
      const idWallet1 = await walletCreate(db, inputWallet1)
      const idWallet2 = await walletCreate(db, inputWallet2)

      const inputAccount1 = testAccountInputCreate({ walletId: idWallet1 })
      const inputAccount2 = testAccountInputCreate({ walletId: idWallet2 })
      const idAccount1 = await dbAccountCreate(db, inputAccount1)
      const idAccount2 = await dbAccountCreate(db, inputAccount2)

      // ACT
      const activeWalletIdBeforeSetActive = await dbSettingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdBeforeSetActive = await dbSettingFindUniqueByKey(db, 'activeAccountId')

      await walletSetActive(db, idWallet2)
      const activeWalletIdAfterSetActive = await dbSettingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdAfterSetActive = await dbSettingFindUniqueByKey(db, 'activeAccountId')

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
      const inputWallet = testWalletInputCreate()
      const idWallet = await walletCreate(db, inputWallet)

      // ACT
      await walletSetActive(db, idWallet)
      const activeWalletIdAfterSetActive = await dbSettingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdAfterSetActive = await dbSettingFindUniqueByKey(db, 'activeAccountId')

      // ASSERT
      expect(activeWalletIdAfterSetActive?.value).toBe(idWallet)
      expect(activeAccountIdAfterSetActive?.value).toBeUndefined()
      expect(console.warn).toHaveBeenCalledWith(`There are no accounts in wallet ${idWallet}`)
    })
  })
})
