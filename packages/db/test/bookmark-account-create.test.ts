import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountFindMany } from '../src/bookmark-account/bookmark-account-find-many.ts'
import { createDbTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-account-create', () => {
  beforeEach(async () => {
    await db.bookmarkAccounts.clear()
  })

  describe('expected behavior', () => {
    it('should create a bookmarkAccount', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkAccountCreateInput()

      // ACT
      await bookmarkAccountCreate(db, input)

      // ASSERT
      const items = await bookmarkAccountFindMany(db, { address: input.address })
      expect(items.map((i) => i.address)).toContain(input.address)
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
      const input = testBookmarkAccountCreateInput()
      vi.spyOn(db.bookmarkAccounts, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(bookmarkAccountCreate(db, input)).rejects.toThrow('Error creating bookmark account')
    })
  })
})
