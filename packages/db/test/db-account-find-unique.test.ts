import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbAccountCreate } from '../src/db-account-create.ts'
import { dbAccountFindUnique } from '../src/db-account-find-unique.ts'
import type { Account } from '../src/entity/account.ts'
import { createDbTest, testAccountInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-account-find-unique', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique account', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testAccountInputCreate()
      const id = await dbAccountCreate(db, input)

      // ACT
      const item = await dbAccountFindUnique(db, id)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.name).toBe(input.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding a unique account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.accounts, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<Account | undefined>,
      )

      // ACT & ASSERT
      await expect(dbAccountFindUnique(db, id)).rejects.toThrow(`Error finding account with id ${id}`)
    })
  })
})
