import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Account } from '../src/entity/account'

import { dbAccountCreate } from '../src/db-account-create'
import { dbAccountFindMany } from '../src/db-account-find-many'
import { dbWalletCreate } from '../src/db-wallet-create'
import { createDbTest, testAccountInputCreate, testWalletInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-account-find-many', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should find many accounts with wallets', async () => {
      // ARRANGE
      expect.assertions(2)
      const account1 = testAccountInputCreate({ name: 'Alpha' })
      const account2 = testAccountInputCreate({ name: 'Beta' })
      const account3 = testAccountInputCreate({ name: 'Charlie' })
      const account1Id = await dbAccountCreate(db, account1)
      const account2Id = await dbAccountCreate(db, account2)
      const account3Id = await dbAccountCreate(db, account3)
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account1Id }))
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account1Id }))
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account2Id }))
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account3Id }))
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account3Id }))
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account3Id }))

      // ACT
      const items = await dbAccountFindMany(db)

      // ASSERT
      expect(items).toHaveLength(3)
      expect(items.map((i) => ({ id: i.id, order: i.order, walletsLength: i.wallets.length }))).toEqual(
        expect.arrayContaining([
          { id: account1Id, order: 0, walletsLength: 2 },
          { id: account2Id, order: 1, walletsLength: 1 },
          { id: account3Id, order: 2, walletsLength: 3 },
        ]),
      )
    })

    it('should find many accounts by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const account1 = testAccountInputCreate({ name: 'Test Account Alpha' })
      const account2 = testAccountInputCreate({ name: 'Test Account Beta' })
      const account3 = testAccountInputCreate({ name: 'Another One' })
      const account1Id = await dbAccountCreate(db, account1)
      const account2Id = await dbAccountCreate(db, account2)
      const account3Id = await dbAccountCreate(db, account3)
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account1Id }))
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account2Id }))
      await dbWalletCreate(db, testWalletInputCreate({ accountId: account3Id }))

      // ACT
      const items = await dbAccountFindMany(db, { name: 'Test Account' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name, account2.name]))
    })

    it('should find many accounts by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const account1 = testAccountInputCreate({ name: 'Test Account Alpha' })
      const account2 = testAccountInputCreate({ name: 'Test Account Beta' })
      const id1 = await dbAccountCreate(db, account1)
      await dbAccountCreate(db, account2)

      // ACT
      const items = await dbAccountFindMany(db, { id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.name).toEqual(account1.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding accounts fails', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.spyOn(db.accounts, 'orderBy').mockImplementation(() => ({
        // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
        filter: () => ({
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Account[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(dbAccountFindMany(db)).rejects.toThrow('Error finding accounts')
    })
  })
})
