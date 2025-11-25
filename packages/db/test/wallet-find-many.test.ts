import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import type { Wallet } from '../src/wallet/wallet.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletFindMany } from '../src/wallet/wallet-find-many.ts'
import { createDbTest, testAccountCreateInput, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('wallet-find-many', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should find many wallets with accounts', async () => {
      // ARRANGE
      expect.assertions(2)
      const wallet1 = testWalletCreateInput({ name: 'Alpha' })
      const wallet2 = testWalletCreateInput({ name: 'Beta' })
      const wallet3 = testWalletCreateInput({ name: 'Charlie' })
      const wallet1Id = await walletCreate(db, wallet1)
      const wallet2Id = await walletCreate(db, wallet2)
      const wallet3Id = await walletCreate(db, wallet3)
      await accountCreate(db, testAccountCreateInput({ walletId: wallet1Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet1Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet2Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet3Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet3Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet3Id }))

      // ACT
      const items = await walletFindMany(db)

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
      const wallet1 = testWalletCreateInput({ name: 'Test Wallet Alpha' })
      const wallet2 = testWalletCreateInput({ name: 'Test Wallet Beta' })
      const wallet3 = testWalletCreateInput({ name: 'Another One' })
      const wallet1Id = await walletCreate(db, wallet1)
      const wallet2Id = await walletCreate(db, wallet2)
      const wallet3Id = await walletCreate(db, wallet3)
      await accountCreate(db, testAccountCreateInput({ walletId: wallet1Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet2Id }))
      await accountCreate(db, testAccountCreateInput({ walletId: wallet3Id }))

      // ACT
      const items = await walletFindMany(db, { name: 'Test Wallet' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([wallet1.name, wallet2.name]))
    })

    it('should find many wallets by id', async () => {
      // ARRANGE
      expect.assertions(3)
      const wallet1 = testWalletCreateInput({ name: 'Test Wallet Alpha' })
      const wallet2 = testWalletCreateInput({ name: 'Test Wallet Beta' })
      const id1 = await walletCreate(db, wallet1)
      await walletCreate(db, wallet2)

      // ACT
      const items = await walletFindMany(db, { id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.name).toEqual(wallet1.name)
      // @ts-expect-error mnemonic does not exist on the type. Here we ensure it's sanitized.
      expect(items[0]?.mnemonic).toEqual(undefined)
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
        filter: () => ({
          // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Wallet[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(walletFindMany(db)).rejects.toThrow('Error finding wallets')
    })
  })
})
