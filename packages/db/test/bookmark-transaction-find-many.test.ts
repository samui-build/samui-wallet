import { signature } from '@solana/kit'
import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BookmarkTransaction } from '../src/bookmark-transaction/bookmark-transaction.ts'
import { bookmarkTransactionCreate } from '../src/bookmark-transaction/bookmark-transaction-create.ts'
import { bookmarkTransactionFindMany } from '../src/bookmark-transaction/bookmark-transaction-find-many.ts'
import { createDbTest, testBookmarkTransactionCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-transaction-find-many', () => {
  beforeEach(async () => {
    await db.bookmarkTransactions.clear()
  })

  describe('expected behavior', () => {
    it('should find many bookmark transactions', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkTransactionCreateInput()
      const bookmark2 = testBookmarkTransactionCreateInput()
      const bookmark3 = testBookmarkTransactionCreateInput()
      await bookmarkTransactionCreate(db, bookmark1)
      await bookmarkTransactionCreate(db, bookmark2)
      await bookmarkTransactionCreate(db, bookmark3)

      // ACT
      const items = await bookmarkTransactionFindMany(db, {})

      // ASSERT
      expect(items).toHaveLength(3)
      expect(items.map((i) => i.label)).toEqual(
        expect.arrayContaining([bookmark1.label, bookmark2.label, bookmark3.label]),
      )
    })

    it('should find many bookmark transactions by a partial label', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkTransactionCreateInput({ label: 'Trading Transaction' })
      const bookmark2 = testBookmarkTransactionCreateInput({ label: 'Staking Transaction' })
      const bookmark3 = testBookmarkTransactionCreateInput({ label: 'Savings' })
      await bookmarkTransactionCreate(db, bookmark1)
      await bookmarkTransactionCreate(db, bookmark2)
      await bookmarkTransactionCreate(db, bookmark3)

      // ACT
      const items = await bookmarkTransactionFindMany(db, { label: 'Transaction' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.label)).toEqual(expect.arrayContaining([bookmark1.label, bookmark2.label]))
    })

    it('should not find bookmark transactions without a label when a label is provided', async () => {
      // ARRANGE
      expect.assertions(1)
      const bookmark1 = testBookmarkTransactionCreateInput({ label: 'Test Label' })
      const bookmark2 = testBookmarkTransactionCreateInput({ label: undefined })
      await bookmarkTransactionCreate(db, bookmark1)
      await bookmarkTransactionCreate(db, bookmark2)

      // ACT
      const items = await bookmarkTransactionFindMany(db, { label: 'Test' })

      // ASSERT
      expect(items).toHaveLength(1)
    })

    it('should find a bookmark transaction by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkTransactionCreateInput({ label: 'Transaction 1' })
      const bookmark2 = testBookmarkTransactionCreateInput({ label: 'Transaction 2' })
      const id1 = await bookmarkTransactionCreate(db, bookmark1)
      await bookmarkTransactionCreate(db, bookmark2)

      // ACT
      const items = await bookmarkTransactionFindMany(db, { id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.id).toEqual(id1)
    })

    it('should find a bookmark transaction by signature', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkTransactionCreateInput({
        label: 'Transaction 1',
      })
      const bookmark2 = testBookmarkTransactionCreateInput({
        label: 'Transaction 2',
        signature: signature(
          '67QRhaJuZeRqoSiifT6yKfuQTUKfvu2exuppyNyT7r2sQCXfBBpr96mdF5TurVDKdWsZ48nx9u5r9uJ87SG9PfvU',
        ),
      })
      await bookmarkTransactionCreate(db, bookmark1)
      await bookmarkTransactionCreate(db, bookmark2)

      // ACT
      const items = await bookmarkTransactionFindMany(db, { signature: bookmark1.signature })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.signature).toEqual(bookmark1.signature)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding bookmark transactions fails', async () => {
      // ARRANGE
      expect.assertions(1)

      vi.spyOn(db.bookmarkTransactions, 'orderBy').mockImplementation(() => ({
        filter: () => ({
          // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
          reverse: () => ({
            toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<BookmarkTransaction[]>,
          }),
        }),
      }))

      // ACT & ASSERT
      await expect(bookmarkTransactionFindMany(db, {})).rejects.toThrow('Error finding bookmark transactions')
    })
  })
})
