import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Wallet } from '../src/entity/wallet'

import { dbWalletCreate } from '../src/db-wallet-create'
import { dbWalletFindMany } from '../src/db-wallet-find-many'
import { createDbTest, testWalletInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-wallet-find-many', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should find many wallets for an account', async () => {
      // ARRANGE
      expect.assertions(2)
      const accountId1 = crypto.randomUUID()
      const accountId2 = crypto.randomUUID()
      const wallet1 = testWalletInputCreate({ accountId: accountId1 })
      const wallet2 = testWalletInputCreate({ accountId: accountId1 })
      const wallet3 = testWalletInputCreate({ accountId: accountId2 })
      await dbWalletCreate(db, wallet1)
      await dbWalletCreate(db, wallet2)
      await dbWalletCreate(db, wallet3)

      // ACT
      const items = await dbWalletFindMany(db, { accountId: accountId1 })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([wallet1.name, wallet2.name]))
    })

    it('should find many wallets for an account by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const accountId = crypto.randomUUID()
      const wallet1 = testWalletInputCreate({ accountId, name: 'Trading Wallet' })
      const wallet2 = testWalletInputCreate({ accountId, name: 'Staking Wallet' })
      const wallet3 = testWalletInputCreate({ accountId, name: 'Savings' })
      await dbWalletCreate(db, wallet1)
      await dbWalletCreate(db, wallet2)
      await dbWalletCreate(db, wallet3)

      // ACT
      const items = await dbWalletFindMany(db, { accountId, name: 'Wallet' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([wallet1.name, wallet2.name]))
    })

    it('should find many wallets for an account by type', async () => {
      // ARRANGE
      expect.assertions(2)
      const accountId = crypto.randomUUID()
      const wallet1 = testWalletInputCreate({ accountId })
      const wallet2 = testWalletInputCreate({ accountId, type: 'Imported' })
      const wallet3 = testWalletInputCreate({ accountId })
      await dbWalletCreate(db, wallet1)
      await dbWalletCreate(db, wallet2)
      await dbWalletCreate(db, wallet3)

      // ACT
      const items = await dbWalletFindMany(db, { accountId, type: 'Derived' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([wallet1.name, wallet3.name]))
    })

    it('should find many wallets for an account by a partial name and type', async () => {
      // ARRANGE
      expect.assertions(2)
      const accountId = crypto.randomUUID()
      const wallet1 = testWalletInputCreate({ accountId, name: 'Trading Wallet' })
      const wallet2 = testWalletInputCreate({ accountId, name: 'Staking Wallet', type: 'Imported' })
      const wallet3 = testWalletInputCreate({ accountId, name: 'Savings', type: 'Watched' })
      const wallet4 = testWalletInputCreate({ accountId, name: 'Another Trading Wallet', type: 'Imported' })
      await dbWalletCreate(db, wallet1)
      await dbWalletCreate(db, wallet2)
      await dbWalletCreate(db, wallet3)
      await dbWalletCreate(db, wallet4)

      // ACT
      const items = await dbWalletFindMany(db, { accountId, name: 'Wallet', type: 'Derived' })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([wallet1.name]))
    })

    it('should find a wallet by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const accountId = crypto.randomUUID()
      const wallet1 = testWalletInputCreate({ accountId, name: 'Wallet 1' })
      const wallet2 = testWalletInputCreate({ accountId, name: 'Wallet 2', type: 'Imported' })
      const id1 = await dbWalletCreate(db, wallet1)
      await dbWalletCreate(db, wallet2)

      // ACT
      const items = await dbWalletFindMany(db, { accountId, id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.id).toEqual(id1)
    })

    it('should find a wallet by publicKey', async () => {
      // ARRANGE
      expect.assertions(2)
      const accountId = crypto.randomUUID()
      const wallet1 = testWalletInputCreate({ accountId, name: 'Wallet 1' })
      const wallet2 = testWalletInputCreate({ accountId, name: 'Wallet 2', type: 'Imported' })
      await dbWalletCreate(db, wallet1)
      await dbWalletCreate(db, wallet2)

      // ACT
      const items = await dbWalletFindMany(db, { accountId, publicKey: wallet1.publicKey })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.publicKey).toEqual(wallet1.publicKey)
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
      const accountId = 'test-account-id'

      vi.spyOn(db.wallets, 'orderBy').mockImplementation(() => ({
        // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
        filter: () => ({
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Wallet[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(dbWalletFindMany(db, { accountId })).rejects.toThrow(
        `Error finding wallets for account id ${accountId}`,
      )
    })
  })
})
