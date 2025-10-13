import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { AccountInputCreate } from '../src/dto/account-input-create'
import type { Account } from '../src/entity/account'

import { dbAccountCreate } from '../src/db-account-create'
import { dbAccountFindMany } from '../src/db-account-find-many'
import { createDbTest } from './test-helpers'

const db = createDbTest()

describe('db-account-find-many', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should find many accounts by a partial name', async () => {
      // ARRANGE
      expect.assertions(2)
      const account1: AccountInputCreate = { mnemonic: 'm', name: 'Test Account Alpha', secret: 's' }
      const account2: AccountInputCreate = { mnemonic: 'm', name: 'Test Account Beta', secret: 's' }
      const account3: AccountInputCreate = { mnemonic: 'm', name: 'Another One', secret: 's' }
      await dbAccountCreate(db, account1)
      await dbAccountCreate(db, account2)
      await dbAccountCreate(db, account3)

      // ACT
      const items = await dbAccountFindMany(db, { name: 'Test Account' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([account1.name, account2.name]))
    })

    it('should find many accounts by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const account1: AccountInputCreate = { mnemonic: 'm', name: 'Test Account Alpha', secret: 's' }
      const account2: AccountInputCreate = { mnemonic: 'm', name: 'Test Account Beta', secret: 's' }
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
      vi.spyOn(db.accounts, 'toArray').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Account[]>,
      )

      // ACT & ASSERT
      await expect(dbAccountFindMany(db)).rejects.toThrow('Error finding accounts')
    })
  })
})
