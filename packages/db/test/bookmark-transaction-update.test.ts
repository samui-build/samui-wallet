import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkTransactionCreate } from '../src/bookmark-transaction/bookmark-transaction-create.ts'
import { bookmarkTransactionFindBySignature } from '../src/bookmark-transaction/bookmark-transaction-find-by-signature.ts'
import { bookmarkTransactionUpdate } from '../src/bookmark-transaction/bookmark-transaction-update.ts'
import { createAppContextTest, testBookmarkTransactionCreateInput } from './test-helpers.ts'

const ctx = createAppContextTest()

describe('bookmark-transaction-update', () => {
  const input = testBookmarkTransactionCreateInput({ label: 'Original Label' })
  let bookmarkId: string

  beforeEach(async () => {
    await ctx.db.bookmarkTransactions.clear()
    bookmarkId = await bookmarkTransactionCreate(ctx, input)
  })

  describe('expected behavior', () => {
    it('should update a bookmark transaction label', async () => {
      // ARRANGE
      expect.assertions(3)
      const newLabel = 'Updated Label'
      const originalBookmark = await bookmarkTransactionFindBySignature(ctx, input.signature)

      // ACT
      const result = await bookmarkTransactionUpdate(ctx, bookmarkId, { label: newLabel })
      const updatedBookmark = await bookmarkTransactionFindBySignature(ctx, input.signature)

      // ASSERT
      expect(result).toBe(1)
      expect(updatedBookmark?.label).toBe(newLabel)
      expect(updatedBookmark?.updatedAt).not.toEqual(originalBookmark?.updatedAt)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when updating a bookmark transaction fails', async () => {
      // ARRANGE
      const id = 'test-id'
      expect.assertions(1)
      vi.spyOn(ctx.db.bookmarkTransactions, 'update').mockRejectedValue(new Error('Test error'))

      // ACT & ASSERT
      await expect(bookmarkTransactionUpdate(ctx, id, { label: 'new label' })).rejects.toThrow(
        `Error updating bookmark transaction with id ${id}`,
      )
    })

    it('should throw an error when the label is too long', async () => {
      // ARRANGE
      expect.assertions(1)
      const newLabel = 'a'.repeat(51)

      // ACT & ASSERT
      await expect(
        bookmarkTransactionUpdate(ctx, bookmarkId, { label: newLabel }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "origin": "string",
            "code": "too_big",
            "maximum": 50,
            "inclusive": true,
            "path": [
              "label"
            ],
            "message": "Too big: expected string to have <=50 characters"
          }
        ]]
      `)
    })
  })
})
