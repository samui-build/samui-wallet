import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { bookmarkTransactionCreate } from '../src/bookmark-transaction/bookmark-transaction-create.ts'
import { bookmarkTransactionDelete } from '../src/bookmark-transaction/bookmark-transaction-delete.ts'
import { bookmarkTransactionFindBySignature } from '../src/bookmark-transaction/bookmark-transaction-find-by-signature.ts'
import { createAppContextTest, testBookmarkTransactionCreateInput } from './test-helpers.ts'

const ctx = createAppContextTest()

describe('bookmark-transaction-delete', () => {
  beforeEach(async () => {
    await ctx.db.bookmarkTransactions.clear()
  })

  describe('expected behavior', () => {
    it('should delete an bookmarkTransaction', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkTransactionCreateInput()
      const id = await bookmarkTransactionCreate(ctx, input)

      // ACT
      await bookmarkTransactionDelete(ctx, id)

      // ASSERT
      const deletedItem = await bookmarkTransactionFindBySignature(ctx, input.signature)
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

    it('should throw an error when deleting an bookmark transaction fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(ctx.db.bookmarkTransactions, 'delete').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<void>,
      )

      // ACT & ASSERT
      await expect(bookmarkTransactionDelete(ctx, id)).rejects.toThrow(
        `Error deleting bookmark transaction with id ${id}`,
      )
    })
  })
})
