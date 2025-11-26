import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkTransactionCreate } from '../src/bookmark-transaction/bookmark-transaction-create.ts'
import { bookmarkTransactionFindMany } from '../src/bookmark-transaction/bookmark-transaction-find-many.ts'
import { bookmarkTransactionToggle } from '../src/bookmark-transaction/bookmark-transaction-toggle.ts'
import { createDbTest, testBookmarkTransactionCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-transaction-toggle', () => {
  beforeEach(async () => {
    await db.bookmarkTransactions.clear()
  })

  describe('expected behavior', () => {
    it('should create a bookmark transaction if it does not exist', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testBookmarkTransactionCreateInput()

      // ACT
      const result = await bookmarkTransactionToggle(db, input.signature)

      // ASSERT
      const items = await bookmarkTransactionFindMany(db, { signature: input.signature })
      expect(items.map((i) => i.signature)).toContain(input.signature)
      expect(result).toBe('created')
    })

    it('should delete a bookmark transaction if it exists', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testBookmarkTransactionCreateInput()
      await bookmarkTransactionCreate(db, input)

      // ACT
      const result = await bookmarkTransactionToggle(db, input.signature)

      // ASSERT
      const items = await bookmarkTransactionFindMany(db, { signature: input.signature })
      expect(items.map((i) => i.signature)).not.toContain(input.signature)
      expect(result).toBe('deleted')
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when toggling an transaction fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkTransactionCreateInput()
      vi.spyOn(db.bookmarkTransactions, 'where').mockImplementationOnce(() => {
        throw new Error('Test error')
      })

      // ACT & ASSERT
      await expect(bookmarkTransactionToggle(db, input.signature)).rejects.toThrow('Test error')
    })
  })
})
