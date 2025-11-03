import { beforeEach, describe, expect, it } from 'vitest'

import { dbAccountCreate } from '../src/db-account-create.ts'
import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key.ts'
import { dbWalletCreate } from '../src/db-wallet-create.ts'
import { dbWalletSetActive } from '../src/db-wallet-set-active.ts'
import { createDbTest, testAccountInputCreate, testWalletInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-wallet-set-active', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.wallets.clear()
    await db.preferences.clear()
  })

  describe('expected behavior', () => {
    it('should set an wallet and its related account to active', async () => {
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
      const activeAccountIdBefore = await dbPreferenceFindUniqueByKey(db, 'activeAccountId')
      const activeWalletIdBefore = await dbPreferenceFindUniqueByKey(db, 'activeWalletId')

      await dbWalletSetActive(db, idWallet2)
      const activeAccountIdAfter = await dbPreferenceFindUniqueByKey(db, 'activeAccountId')
      const activeWalletIdAfter = await dbPreferenceFindUniqueByKey(db, 'activeWalletId')

      // ASSERT
      expect(activeAccountIdBefore?.value).toBe(idAccount1)
      expect(activeWalletIdBefore?.value).toBe(idWallet1)
      expect(activeAccountIdAfter?.value).toBe(idAccount2)
      expect(activeWalletIdAfter?.value).toBe(idWallet2)
    })
  })

  describe('unexpected behavior', () => {
    it('should throw an error when wallet does not exist', async () => {
      // ARRANGE
      expect.assertions(1)
      const nonExistentId = 'non-existent-wallet-id'

      // ACT & ASSERT
      await expect(dbWalletSetActive(db, nonExistentId)).rejects.toThrow(`Wallet with id ${nonExistentId} not found`)
    })
  })
})
