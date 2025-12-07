import { address } from '@solana/kit'
import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Account } from '../src/account/account.ts'
import { accountCreate } from '../src/account/account-create.ts'
import { accountFindMany } from '../src/account/account-find-many.ts'
import { randomId } from '../src/random-id.ts'
import { createDbTest, testAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('account-find-many', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should find many accounts for a wallet', async () => {
      // ARRANGE
      expect.assertions(3)
      const walletId1 = randomId()
      const walletId2 = randomId()
      const account1 = testAccountCreateInput({ walletId: walletId1 })
      const account2 = testAccountCreateInput({ walletId: walletId1 })
      const account3 = testAccountCreateInput({ walletId: walletId2 })
      await accountCreate(db, account1)
      await accountCreate(db, account2)
      await accountCreate(db, account3)

      // ACT
      const items = await accountFindMany(db, { walletId: walletId1 })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name, account2.name]))
      // @ts-expect-error secretKey does not exist on the type. Here we ensure it's sanitized.
      expect(items.map((i) => i.secretKey).filter(Boolean).length).toEqual(0)
    })

    it('should find many accounts for a wallet by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = randomId()
      const account1 = testAccountCreateInput({ name: 'Trading Account', walletId })
      const account2 = testAccountCreateInput({ name: 'Staking Account', walletId })
      const account3 = testAccountCreateInput({ name: 'Savings', walletId })
      await accountCreate(db, account1)
      await accountCreate(db, account2)
      await accountCreate(db, account3)

      // ACT
      const items = await accountFindMany(db, { name: 'Account', walletId })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name, account2.name]))
    })

    it('should find many accounts for a wallet by type', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = randomId()
      const account1 = testAccountCreateInput({ walletId })
      const account2 = testAccountCreateInput({ type: 'Imported', walletId })
      const account3 = testAccountCreateInput({ walletId })
      await accountCreate(db, account1)
      await accountCreate(db, account2)
      await accountCreate(db, account3)

      // ACT
      const items = await accountFindMany(db, { type: 'Derived', walletId })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name, account3.name]))
    })

    it('should find many accounts for a wallet by a partial name and type', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = randomId()
      const account1 = testAccountCreateInput({ name: 'Trading Account', walletId })
      const account2 = testAccountCreateInput({ name: 'Staking Account', type: 'Imported', walletId })
      const account3 = testAccountCreateInput({ name: 'Savings', type: 'Watched', walletId })
      const account4 = testAccountCreateInput({ name: 'Some Trading Account', type: 'Imported', walletId })
      await accountCreate(db, account1)
      await accountCreate(db, account2)
      await accountCreate(db, account3)
      await accountCreate(db, account4)

      // ACT
      const items = await accountFindMany(db, { name: 'Account', type: 'Derived', walletId })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name]))
    })

    it('should find an account by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = randomId()
      const account1 = testAccountCreateInput({ name: 'Account 1', walletId })
      const account2 = testAccountCreateInput({ name: 'Account 2', type: 'Imported', walletId })
      const id1 = await accountCreate(db, account1)
      await accountCreate(db, account2)

      // ACT
      const items = await accountFindMany(db, { id: id1, walletId })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.id).toEqual(id1)
    })

    it('should find an account by publicKey', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = randomId()
      const account1 = testAccountCreateInput({
        name: 'Account 1',
        publicKey: address('So11111111111111111111111111111111111111112'),
        walletId,
      })
      const account2 = testAccountCreateInput({
        name: 'Account 2',
        publicKey: address('So11111111111111111111111111111111111111113'),
        type: 'Imported',
        walletId,
      })
      await accountCreate(db, account1)
      await accountCreate(db, account2)

      // ACT
      const items = await accountFindMany(db, { publicKey: account1.publicKey, walletId })

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
      await expect(accountFindMany(db, { walletId })).rejects.toThrow(
        `Error finding accounts for wallet id ${walletId}`,
      )
    })
  })
})
