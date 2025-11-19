import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { dbWalletCreate } from '../src/db-wallet-create.ts'
import { dbWalletFindMany } from '../src/db-wallet-find-many.ts'
import type { Wallet } from '../src/entity/wallet.ts'
import { createDbTest, testAccountCreateInput, testWalletInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-wallet-find-many', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should find many wallets with accounts', async () => {
      // ARRANGE
      expect.assertions(2)
      const wallet1 = testWalletInputCreate({ name: 'Alpha' })
      const wallet2 = testWalletInputCreate({ name: 'Beta' })
      const wallet3 = testWalletInputCreate({ name: 'Charlie' })
      const wallet1Id = await dbWalletCreate(db, wallet1)
      const wallet2Id = await dbWalletCreate(db, wallet2)
      const wallet3Id = await dbWalletCreate(db, wallet3)
      await accountCreate(db, testAccountCreateInput({ walletId: wallet1Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet1Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet2Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet3Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet3Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet3Id }))

      // ACT
      const items = await dbWalletFindMany(db)

      // ASSERT
      expect(items).toHaveLength(3)
      expect(
        items.map((i) => ({
          accountsLength: i.accounts.length,
          accountsOrders: i.accounts.map((a) => a.order),
          id: i.id,
          order: i.order,
        })),
      ).toEqual(
        expect.arrayContaining([
          { accountsLength: 2, accountsOrders: [0, 1], id: wallet1Id, order: 0 },
          { accountsLength: 1, accountsOrders: [0], id: wallet2Id, order: 1 },
          { accountsLength: 3, accountsOrders: [0, 1, 2], id: wallet3Id, order: 2 },
        ]),
      )
    })

    it('should find many wallets by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const wallet1 = testWalletInputCreate({ name: 'Test Wallet Alpha' })
      const wallet2 = testWalletInputCreate({ name: 'Test Wallet Beta' })
      const wallet3 = testWalletInputCreate({ name: 'Another One' })
      const wallet1Id = await dbWalletCreate(db, wallet1)
      const wallet2Id = await dbWalletCreate(db, wallet2)
      const wallet3Id = await dbWalletCreate(db, wallet3)
      await accountCreate(db, testAccountCreateInput({ walletId: wallet1Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet2Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet3Id }))

      // ACT
      const items = await dbWalletFindMany(db, { name: 'Test Wallet' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([wallet1.name, wallet2.name]))
    })

    it('should find many wallets by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const wallet1 = testWalletInputCreate({ name: 'Test Wallet Alpha' })
      const wallet2 = testWalletInputCreate({ name: 'Test Wallet Beta' })
      const id1 = await dbWalletCreate(db, wallet1)
      await dbWalletCreate(db, wallet2)

      // ACT
      const items = await dbWalletFindMany(db, { id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.name).toEqual(wallet1.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding wallets fails', async () => {
      // ARRANGE
      expect.assertions(1)
      vi.spyOn(db.wallets, 'orderBy').mockImplementation(() => ({
        // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
        filter: () => ({
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Wallet[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(dbWalletFindMany(db)).rejects.toThrow('Error finding wallets')
    })
  })
})
