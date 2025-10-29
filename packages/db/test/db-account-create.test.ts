import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbAccountCreate } from '../src/db-account-create'
import { dbAccountFindMany } from '../src/db-account-find-many'
import { dbAccountFindUnique } from '../src/db-account-find-unique'
import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key'
import { createDbTest, testAccountInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-account-create', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.preferences.clear()
  })

  describe('expected behavior', () => {
    it('should create an account', async () => {
      // ARRANGE
      expect.assertions(3)
      const input = testAccountInputCreate()

      // ACT
      const result = await dbAccountCreate(db, input)

      // ASSERT
      const item = await dbAccountFindUnique(db, result)
      expect(item?.mnemonic).toBe(input.mnemonic)
      expect(item?.name).toBe(input.name)
      expect(item?.order).toBe(0)
    })

    it('should create an account and set activeAccountId preference', async () => {
      // ARRANGE
      expect.assertions(3)
      const input = testAccountInputCreate()
      // ACT
      const activeAccountIdBefore = await dbPreferenceFindUniqueByKey(db, 'activeAccountId')
      const result = await dbAccountCreate(db, input)
      const activeAccountIdAfter = await dbPreferenceFindUniqueByKey(db, 'activeAccountId')

      // ASSERT
      const items = await dbAccountFindMany(db)
      expect(items.map((i) => i.name)).toContain(input.name)
      expect(activeAccountIdBefore).toBeNull()
      expect(activeAccountIdAfter?.value).toBe(result)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when creating an account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testAccountInputCreate()
      vi.spyOn(db.accounts, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbAccountCreate(db, input)).rejects.toThrow('Error creating account')
    })
  })
})
