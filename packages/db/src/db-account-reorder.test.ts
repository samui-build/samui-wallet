import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Database } from './database'
import type { Account } from './entity/account'

import { createDbTest, testAccountInputCreate } from '../test/test-helpers'
import { dbAccountCreate } from './db-account-create'
import { dbAccountFindMany } from './db-account-find-many'
import { dbAccountReorder } from './db-account-reorder'

describe('dbAccountReorder', () => {
  let db: Database
  let accounts: Account[] = []
  const beforeEachAssertions = 1

  beforeAll(async () => {
    db = createDbTest()
  })

  beforeEach(async () => {
    await db.accounts.clear()
    accounts = []
    // ARRANGE: Create 5 accounts
    for (let i = 0; i < 5; i++) {
      const id = await dbAccountCreate(db, testAccountInputCreate({ name: `Account ${i}` }))
      const account = await db.accounts.get(id)
      if (account) {
        accounts.push(account)
      }
    }
    // Initial order: Account 0 (0), Account 1 (1), Account 2 (2), Account 3 (3), Account 4 (4)
    expect(accounts.length).toBe(5)
  })

  describe('expected behavior', () => {
    it('should move an account down the list', async () => {
      // ARRANGE
      expect.assertions(5 + beforeEachAssertions)
      const accountToMove = accounts[1] // Account 1, order 1
      const newOrder = 3

      // ACT
      await dbAccountReorder(db, accountToMove!.id, newOrder)

      // ASSERT
      const result = await dbAccountFindMany(db)

      expect(result.length).toBe(5)
      // Expected order: 0, 2, 3, 1, 4
      expect(result[0]?.name).toBe('Account 0') // order 0
      expect(result[1]?.name).toBe('Account 2') // order 1 (was 2)
      expect(result[2]?.name).toBe('Account 3') // order 2 (was 3)
      expect(result[3]?.name).toBe('Account 1') // order 3 (was 1)
    })

    it('should move an account up the list', async () => {
      // ARRANGE
      expect.assertions(5 + beforeEachAssertions)
      const accountToMove = accounts[3] // Account 3, order 3
      const newOrder = 1

      // ACT
      await dbAccountReorder(db, accountToMove!.id, newOrder)

      // ASSERT
      const result = await dbAccountFindMany(db)
      expect(result.length).toBe(5)
      // Expected order: 0, 3, 1, 2, 4
      expect(result[0]?.name).toBe('Account 0') // order 0
      expect(result[1]?.name).toBe('Account 3') // order 1 (was 3)
      expect(result[2]?.name).toBe('Account 1') // order 2 (was 1)
      expect(result[3]?.name).toBe('Account 2') // order 3 (was 2)
    })

    it('should not change order if newOrder is the same as oldOrder', async () => {
      // ARRANGE
      expect.assertions(5 + beforeEachAssertions)
      const accountToMove = accounts[2] // Account 2, order 2
      const newOrder = 2

      // ACT
      await dbAccountReorder(db, accountToMove!.id, newOrder)

      // ASSERT
      const result = await dbAccountFindMany(db)
      expect(result[0]?.name).toBe('Account 0')
      expect(result[1]?.name).toBe('Account 1')
      expect(result[2]?.name).toBe('Account 2')
      expect(result[3]?.name).toBe('Account 3')
      expect(result[4]?.name).toBe('Account 4')
    })

    it('should handle moving an item to the beginning of the list', async () => {
      // ARRANGE
      expect.assertions(2 + beforeEachAssertions)
      const accountToMove = accounts[4] // Account 4, order 4
      const newOrder = 0

      // ACT
      await dbAccountReorder(db, accountToMove!.id, newOrder)

      // ASSERT
      const result = await dbAccountFindMany(db)
      expect(result[0]?.name).toBe('Account 4')
      expect(result[0]?.order).toBe(0)
    })

    it('should handle moving an item to the end of the list', async () => {
      // ARRANGE
      expect.assertions(2 + beforeEachAssertions)
      const accountToMove = accounts[0] // Account 0, order 0
      const newOrder = 4

      // ACT
      await dbAccountReorder(db, accountToMove!.id, newOrder)

      // ASSERT
      const result = await dbAccountFindMany(db)
      expect(result[4]?.name).toBe('Account 0')
      expect(result[4]?.order).toBe(4)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should do nothing if account id does not exist', async () => {
      // ARRANGE
      expect.assertions(1 + beforeEachAssertions)
      const initialAccounts = await dbAccountFindMany(db)

      // ACT
      await dbAccountReorder(db, 'non-existent-id', 2)

      // ASSERT
      const finalAccounts = await dbAccountFindMany(db)
      expect(finalAccounts).toEqual(initialAccounts)
    })
  })
})
