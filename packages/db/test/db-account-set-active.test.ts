import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbAccountCreate } from '../src/db-account-create'
import { dbAccountSetActive } from '../src/db-account-set-active'
import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key'
import { dbWalletCreate } from '../src/db-wallet-create'
import { createDbTest, testAccountInputCreate, testWalletInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-account-set-active', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.wallets.clear()
    await db.preferences.clear()
  })

  describe('expected behavior', () => {
    it('should set an account and its first wallet to active', async () => {
      // ARRANGE
      expect.assertions(4)
      const inputAccount1 = testAccountInputCreate()
      const inputAccount2 = testAccountInputCreate()
      const idAccount1 = await dbAccountCreate(db, inputAccount1)
      const idAccount2 = await dbAccountCreate(db, inputAccount2)

      const inputWallet1 = testWalletInputCreate({ accountId: idAccount1 })
      const inputWallet2 = testWalletInputCreate({ accountId: idAccount2 })
      const idWallet1 = await dbWalletCreate(db, inputWallet1)
      const idWallet2 = await dbWalletCreate(db, inputWallet2)

      // ACT
      const activeAccountIdBeforeSetActive = await dbPreferenceFindUniqueByKey(db, 'activeAccountId')
      const activeWalletIdBeforeSetActive = await dbPreferenceFindUniqueByKey(db, 'activeWalletId')

      await dbAccountSetActive(db, idAccount2)
      const activeAccountIdAfterSetActive = await dbPreferenceFindUniqueByKey(db, 'activeAccountId')
      const activeWalletIdAfterSetActive = await dbPreferenceFindUniqueByKey(db, 'activeWalletId')

      // ASSERT
      expect(activeAccountIdBeforeSetActive?.value).toBe(idAccount1)
      expect(activeWalletIdBeforeSetActive?.value).toBe(idWallet1)
      expect(activeAccountIdAfterSetActive?.value).toBe(idAccount2)
      expect(activeWalletIdAfterSetActive?.value).toBe(idWallet2)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when account does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const nonExistentId = 'non-existent-account-id'

      // ACT & ASSERT
      await expect(dbAccountSetActive(db, nonExistentId)).rejects.toThrow(`Account with id ${nonExistentId} not found`)
    })

    it('should handle account with no wallets gracefully', async () => {
      // ARRANGE
      expect.assertions(3)
      const inputAccount = testAccountInputCreate()
      const idAccount = await dbAccountCreate(db, inputAccount)

      // ACT
      await dbAccountSetActive(db, idAccount)
      const activeAccountIdAfterSetActive = await dbPreferenceFindUniqueByKey(db, 'activeAccountId')
      const activeWalletIdAfterSetActive = await dbPreferenceFindUniqueByKey(db, 'activeWalletId')

      // ASSERT
      expect(activeAccountIdAfterSetActive?.value).toBe(idAccount)
      expect(activeWalletIdAfterSetActive?.value).toBeUndefined()
      expect(console.warn).toHaveBeenCalledWith(`There are no wallets in account ${idAccount}`)
    })
  })
})
