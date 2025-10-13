import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { WalletInputCreate } from '../src/dto/wallet-input-create'

import { dbWalletCreate } from '../src/db-wallet-create'
import { dbWalletFindMany } from '../src/db-wallet-find-many'
import { createDbTest, randomName } from './test-helpers'

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
      const wallet1: WalletInputCreate = {
        accountId: accountId1,
        name: randomName('wallet-1'),
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
      const wallet2: WalletInputCreate = {
        accountId: accountId1,
        name: randomName('wallet-2'),
        publicKey: crypto.randomUUID(),
        type: 'Imported',
      }
      const wallet3: WalletInputCreate = {
        accountId: accountId2,
        name: randomName('wallet-3'),
        publicKey: crypto.randomUUID(),
        type: 'Watched',
      }
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
      const wallet1: WalletInputCreate = {
        accountId,
        name: 'Trading Wallet',
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
      const wallet2: WalletInputCreate = {
        accountId,
        name: 'Staking Wallet',
        publicKey: crypto.randomUUID(),
        type: 'Imported',
      }
      const wallet3: WalletInputCreate = {
        accountId,
        name: 'Savings',
        publicKey: crypto.randomUUID(),
        type: 'Watched',
      }
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
      const wallet1: WalletInputCreate = {
        accountId,
        name: 'Trading Wallet',
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
      const wallet2: WalletInputCreate = {
        accountId,
        name: 'Staking Wallet',
        publicKey: crypto.randomUUID(),
        type: 'Imported',
      }
      const wallet3: WalletInputCreate = {
        accountId,
        name: 'Savings Wallet',
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
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
      const wallet1: WalletInputCreate = {
        accountId,
        name: 'Trading Wallet',
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
      const wallet2: WalletInputCreate = {
        accountId,
        name: 'Staking Wallet',
        publicKey: crypto.randomUUID(),
        type: 'Imported',
      }
      const wallet3: WalletInputCreate = {
        accountId,
        name: 'Savings',
        publicKey: crypto.randomUUID(),
        type: 'Watched',
      }
      const wallet4: WalletInputCreate = {
        accountId,
        name: 'Another Trading Wallet',
        publicKey: crypto.randomUUID(),
        type: 'Imported',
      }
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
      const wallet1: WalletInputCreate = {
        accountId,
        name: 'Wallet 1',
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
      const wallet2: WalletInputCreate = {
        accountId,
        name: 'Wallet 2',
        publicKey: crypto.randomUUID(),
        type: 'Imported',
      }
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
      const wallet1: WalletInputCreate = {
        accountId,
        name: 'Wallet 1',
        publicKey: crypto.randomUUID(),
        type: 'Derived',
      }
      const wallet2: WalletInputCreate = {
        accountId,
        name: 'Wallet 2',
        publicKey: crypto.randomUUID(),
        type: 'Imported',
      }
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

      // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
      // The spy incorrectly expects a full 'Collection' when we only need to mock the 'WhereClause' chain.
      vi.spyOn(db.wallets, 'where').mockImplementation(() => ({
        equals: () => ({
          toArray: () => Promise.reject(new Error('Test error')),
        }),
      }))

      // ACT & ASSERT
      await expect(dbWalletFindMany(db, { accountId })).rejects.toThrow(
        `Error finding wallets for account id ${accountId}`,
      )
    })
  })
})
