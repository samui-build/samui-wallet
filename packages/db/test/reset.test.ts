import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { reset } from '../src/reset.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('reset', () => {
  beforeEach(async () => {
    await Promise.all(db.tables.map((table) => table.clear()))
  })

  describe('expected behavior', () => {
    it('should clear tables and populate default records', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = await walletCreate(db, testWalletCreateInput())
      await accountCreate(db, testAccountCreateInput({ walletId }))

      // ACT
      await reset(db)
      const result = {
        accounts: await db.accounts.count(),
        bookmarkAccounts: await db.bookmarkAccounts.count(),
        bookmarkTransactions: await db.bookmarkTransactions.count(),
        networks: await db.networks.count(),
        settings: await db.settings.count(),
        wallets: await db.wallets.count(),
      }

      // ASSERT
      expect(result).toEqual({
        accounts: 0,
        bookmarkAccounts: 0,
        bookmarkTransactions: 0,
        networks: 3,
        settings: 2,
        wallets: 0,
      })
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should populate default records when tables are already empty', async () => {
      // ARRANGE
      expect.assertions(2)

      // ACT
      await reset(db)
      const result1 = await db.networks.count()
      const result2 = await db.settings.count()

      // ASSERT
      expect(result1).toBe(3)
      expect(result2).toBe(2)
    })
  })
})
