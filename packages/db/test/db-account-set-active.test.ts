import { beforeEach, describe, expect, it } from 'vitest'
import { dbAccountCreate } from '../src/db-account-create.ts'
import { dbAccountSetActive } from '../src/db-account-set-active.ts'
import { dbSettingFindUniqueByKey } from '../src/db-setting-find-unique-by-key.ts'
import { dbWalletCreate } from '../src/db-wallet-create.ts'
import { createDbTest, testAccountInputCreate, testWalletInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-account-set-active', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.settings.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should set an account and its related wallet to active', async () => {
      // ARRANGE
      expect.assertions(4)
      const inputWallet1 = testWalletInputCreate()
      const inputWallet2 = testWalletInputCreate()
      const idWallet1 = await dbWalletCreate(db, inputWallet1)
      const idWallet2 = await dbWalletCreate(db, inputWallet2)

      const inputAccount1 = testAccountInputCreate({ walletId: idWallet1 })
      const inputAccount2 = testAccountInputCreate({ walletId: idWallet2 })
      const idAccount1 = await dbAccountCreate(db, inputAccount1)
      const idAccount2 = await dbAccountCreate(db, inputAccount2)

      // ACT
      const activeWalletIdBefore = await dbSettingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdBefore = await dbSettingFindUniqueByKey(db, 'activeAccountId')

      await dbAccountSetActive(db, idAccount2)
      const activeWalletIdAfter = await dbSettingFindUniqueByKey(db, 'activeWalletId')
      const activeAccountIdAfter = await dbSettingFindUniqueByKey(db, 'activeAccountId')

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
      await expect(dbAccountSetActive(db, nonExistentId)).rejects.toThrow(`Account with id ${nonExistentId} not found`)
    })
  })
})
