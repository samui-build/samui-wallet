import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Account } from '../src/account/account.ts'
import { accountCreate } from '../src/account/account-create.ts'
import { accountFindMany } from '../src/account/account-find-many.ts'
import { accountUpdateOrder } from '../src/account/account-update-order.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('accountUpdateOrder', () => {
  let walletId: string
  beforeEach(async () => {
    await db.wallets.clear()
    await db.accounts.clear()
    walletId = await walletCreate(db, testWalletCreateInput())
  })

  describe('expected behavior', () => {
    let account1: Account, account2: Account, account3: Account, account4: Account

    beforeEach(async () => {
      await Promise.all([
        accountCreate(db, testAccountCreateInput({ name: 'Account 1', walletId })),
        accountCreate(db, testAccountCreateInput({ name: 'Account 2', walletId })),
        accountCreate(db, testAccountCreateInput({ name: 'Account 3', walletId })),
        accountCreate(db, testAccountCreateInput({ name: 'Account 4', walletId })),
      ])
      const accounts = await accountFindMany(db)
      account1 = accounts.find((a) => a.name === 'Account 1') as Account
      account2 = accounts.find((a) => a.name === 'Account 2') as Account
      account3 = accounts.find((a) => a.name === 'Account 3') as Account
      account4 = accounts.find((a) => a.name === 'Account 4') as Account
    })

    it('should move an account to a lower order', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await accountUpdateOrder(db, { id: account4.id, order: 1 })
      const result = await accountFindMany(db)

      // ASSERT
      expect(result.find((a) => a.id === account1.id)?.order).toBe(0)
      expect(result.find((a) => a.id === account4.id)?.order).toBe(1)
      expect(result.find((a) => a.id === account2.id)?.order).toBe(2)
      expect(result.find((a) => a.id === account3.id)?.order).toBe(3)
    })

    it('should move an account to a higher order', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await accountUpdateOrder(db, { id: account1.id, order: 3 })
      const result = await accountFindMany(db)

      // ASSERT
      expect(result.find((a) => a.id === account2.id)?.order).toBe(0)
      expect(result.find((a) => a.id === account3.id)?.order).toBe(1)
      expect(result.find((a) => a.id === account4.id)?.order).toBe(2)
      expect(result.find((a) => a.id === account1.id)?.order).toBe(3)
    })

    it('should not change order if moving to the same position', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await accountUpdateOrder(db, { id: account2.id, order: 1 })
      const result = await accountFindMany(db)

      // ASSERT
      expect(result.find((a) => a.id === account1.id)?.order).toBe(0)
      expect(result.find((a) => a.id === account2.id)?.order).toBe(1)
      expect(result.find((a) => a.id === account3.id)?.order).toBe(2)
      expect(result.find((a) => a.id === account4.id)?.order).toBe(3)
    })

    it('should clamp order if out of bounds (lower)', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await accountUpdateOrder(db, { id: account3.id, order: -100 })
      const result = await accountFindMany(db)

      // ASSERT
      expect(result.find((a) => a.id === account3.id)?.order).toBe(0)
      expect(result.find((a) => a.id === account1.id)?.order).toBe(1)
      expect(result.find((a) => a.id === account2.id)?.order).toBe(2)
      expect(result.find((a) => a.id === account4.id)?.order).toBe(3)
    })

    it('should clamp order if out of bounds (higher)', async () => {
      // ARRANGE
      expect.assertions(4)

      // ACT
      await accountUpdateOrder(db, { id: account2.id, order: 100 })
      const result = await accountFindMany(db)

      // ASSERT
      expect(result.find((a) => a.id === account1.id)?.order).toBe(0)
      expect(result.find((a) => a.id === account3.id)?.order).toBe(1)
      expect(result.find((a) => a.id === account4.id)?.order).toBe(2)
      expect(result.find((a) => a.id === account2.id)?.order).toBe(3)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when account is not found', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT & ASSERT
      await expect(accountUpdateOrder(db, { id: 'non-existent', order: 0 })).rejects.toThrow(
        'Account with id non-existent not found',
      )
    })
  })
})
