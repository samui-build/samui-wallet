import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDbTest, randomName } from './test-helpers'
import { dbAccountCreate, DbAccountCreateInput } from '../src/db-account-create'
import { dbAccountFindMany } from '../src/db-account-find-many'

const db = createDbTest()

describe('db-account-create', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should create an account', async () => {
      // ARRANGE
      expect.assertions(1)
      const input: DbAccountCreateInput = { name: randomName('account'), secret: 'bar', mnemonic: 'baz' }

      // ACT
      await dbAccountCreate(db, input)

      // ASSERT
      const items = await dbAccountFindMany(db)
      expect(items.map((i) => i.name)).toContain(input.name)
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
      const input: DbAccountCreateInput = { name: 'test', secret: 'bar', mnemonic: 'baz' }
      vi.spyOn(db.accounts, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbAccountCreate(db, input)).rejects.toThrow('Error creating account')
    })
  })
})
