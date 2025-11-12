import { address } from '@solana/kit'
import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbAccountCreate } from '../src/db-account-create.ts'
import { dbAccountFindMany } from '../src/db-account-find-many.ts'
import type { Account } from '../src/entity/account.ts'
import { createDbTest, testAccountInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-account-find-many', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should find many accounts for a wallet', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId1 = crypto.randomUUID()
      const walletId2 = crypto.randomUUID()
      const account1 = testAccountInputCreate({ walletId: walletId1 })
      const account2 = testAccountInputCreate({ walletId: walletId1 })
      const account3 = testAccountInputCreate({ walletId: walletId2 })
      await dbAccountCreate(db, account1)
      await dbAccountCreate(db, account2)
      await dbAccountCreate(db, account3)

      // ACT
      const items = await dbAccountFindMany(db, { walletId: walletId1 })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name, account2.name]))
    })

    it('should find many accounts for a wallet by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = crypto.randomUUID()
      const account1 = testAccountInputCreate({ name: 'Trading Account', walletId })
      const account2 = testAccountInputCreate({ name: 'Staking Account', walletId })
      const account3 = testAccountInputCreate({ name: 'Savings', walletId })
      await dbAccountCreate(db, account1)
      await dbAccountCreate(db, account2)
      await dbAccountCreate(db, account3)

      // ACT
      const items = await dbAccountFindMany(db, { name: 'Account', walletId })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name, account2.name]))
    })

    it('should find many accounts for a wallet by type', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = crypto.randomUUID()
      const account1 = testAccountInputCreate({ walletId })
      const account2 = testAccountInputCreate({ type: 'Imported', walletId })
      const account3 = testAccountInputCreate({ walletId })
      await dbAccountCreate(db, account1)
      await dbAccountCreate(db, account2)
      await dbAccountCreate(db, account3)

      // ACT
      const items = await dbAccountFindMany(db, { type: 'Derived', walletId })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name, account3.name]))
    })

    it('should find many accounts for a wallet by a partial name and type', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = crypto.randomUUID()
      const account1 = testAccountInputCreate({ name: 'Trading Account', walletId })
      const account2 = testAccountInputCreate({ name: 'Staking Account', type: 'Imported', walletId })
      const account3 = testAccountInputCreate({ name: 'Savings', type: 'Watched', walletId })
      const account4 = testAccountInputCreate({ name: 'Another Trading Account', type: 'Imported', walletId })
      await dbAccountCreate(db, account1)
      await dbAccountCreate(db, account2)
      await dbAccountCreate(db, account3)
      await dbAccountCreate(db, account4)

      // ACT
      const items = await dbAccountFindMany(db, { name: 'Account', type: 'Derived', walletId })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name]))
    })

    it('should find an account by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = crypto.randomUUID()
      const account1 = testAccountInputCreate({ name: 'Account 1', walletId })
      const account2 = testAccountInputCreate({ name: 'Account 2', type: 'Imported', walletId })
      const id1 = await dbAccountCreate(db, account1)
      await dbAccountCreate(db, account2)

      // ACT
      const items = await dbAccountFindMany(db, { id: id1, walletId })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.id).toEqual(id1)
    })

    it('should find an account by publicKey', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = crypto.randomUUID()
      const account1 = testAccountInputCreate({
        name: 'Account 1',
        publicKey: address('So11111111111111111111111111111111111111112'),
        walletId,
      })
      const account2 = testAccountInputCreate({
        name: 'Account 2',
        publicKey: address('So11111111111111111111111111111111111111113'),
        type: 'Imported',
        walletId,
      })
      await dbAccountCreate(db, account1)
      await dbAccountCreate(db, account2)

      // ACT
      const items = await dbAccountFindMany(db, { publicKey: account1.publicKey, walletId })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.publicKey).toEqual(account1.publicKey)
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
      const walletId = 'test-wallet-id'

      vi.spyOn(db.accounts, 'orderBy').mockImplementation(() => ({
        // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
        filter: () => ({
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<Account[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(dbAccountFindMany(db, { walletId })).rejects.toThrow(
        `Error finding accounts for wallet id ${walletId}`,
      )
    })
  })
})
