import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountDelete } from '../src/bookmark-account/bookmark-account-delete.ts'
import { bookmarkAccountFindByAddress } from '../src/bookmark-account/bookmark-account-find-by-address.ts'
import { createDbContextTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('bookmark-account-delete', () => {
  beforeEach(async () => {
    await ctx.db.bookmarkAccounts.clear()
  })

  describe('expected behavior', () => {
    it('should delete an bookmarkAccount', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkAccountCreateInput()
      const id = await bookmarkAccountCreate(ctx, input)

      // ACT
      await bookmarkAccountDelete(ctx, id)

      // ASSERT
      const deletedItem = await bookmarkAccountFindByAddress(ctx, input.address)
      expect(deletedItem).toBeNull()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when deleting an bookmark account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(ctx.db.bookmarkAccounts, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(bookmarkAccountDelete(ctx, id)).rejects.toThrow(`Error deleting bookmark account with id ${id}`)
    })
  })
})
