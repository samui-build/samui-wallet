import { address } from '@solana/kit'
import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BookmarkAccount } from '../src/bookmark-account/bookmark-account.ts'
import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountFindMany } from '../src/bookmark-account/bookmark-account-find-many.ts'
import { createDbTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-account-find-many', () => {
  beforeEach(async () => {
    await db.bookmarkAccounts.clear()
  })

  describe('expected behavior', () => {
    it('should find many bookmark accounts', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkAccountCreateInput()
      const bookmark2 = testBookmarkAccountCreateInput()
      const bookmark3 = testBookmarkAccountCreateInput()
      await bookmarkAccountCreate(db, bookmark1)
      await bookmarkAccountCreate(db, bookmark2)
      await bookmarkAccountCreate(db, bookmark3)

      // ACT
      const items = await bookmarkAccountFindMany(db, {})

      // ASSERT
      expect(items).toHaveLength(3)
      expect(items.map((i) => i.label)).toEqual(
        expect.arrayContaining([bookmark1.label, bookmark2.label, bookmark3.label]),
      )
    })

    it('should find many bookmark accounts by a partial label', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkAccountCreateInput({ label: 'Trading Account' })
      const bookmark2 = testBookmarkAccountCreateInput({ label: 'Staking Account' })
      const bookmark3 = testBookmarkAccountCreateInput({ label: 'Savings' })
      await bookmarkAccountCreate(db, bookmark1)
      await bookmarkAccountCreate(db, bookmark2)
      await bookmarkAccountCreate(db, bookmark3)

      // ACT
      const items = await bookmarkAccountFindMany(db, { label: 'Account' })

      // ASSERT
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.label)).toEqual(expect.arrayContaining([bookmark1.label, bookmark2.label]))
    })

    it('should not find bookmark accounts without a label when a label is provided', async () => {
      // ARRANGE
      expect.assertions(1)
      const bookmark1 = testBookmarkAccountCreateInput({ label: 'Test Label' })
      const bookmark2 = testBookmarkAccountCreateInput({ label: undefined })
      await bookmarkAccountCreate(db, bookmark1)
      await bookmarkAccountCreate(db, bookmark2)

      // ACT
      const items = await bookmarkAccountFindMany(db, { label: 'Test' })

      // ASSERT
      expect(items).toHaveLength(1)
    })

    it('should find a bookmark account by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkAccountCreateInput({ label: 'Account 1' })
      const bookmark2 = testBookmarkAccountCreateInput({ label: 'Account 2' })
      const id1 = await bookmarkAccountCreate(db, bookmark1)
      await bookmarkAccountCreate(db, bookmark2)

      // ACT
      const items = await bookmarkAccountFindMany(db, { id: id1 })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.id).toEqual(id1)
    })

    it('should find a bookmark account by address', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkAccountCreateInput({
        address: address('So11111111111111111111111111111111111111112'),
        label: 'Account 1',
      })
      const bookmark2 = testBookmarkAccountCreateInput({
        address: address('So11111111111111111111111111111111111111113'),
        label: 'Account 2',
      })
      await bookmarkAccountCreate(db, bookmark1)
      await bookmarkAccountCreate(db, bookmark2)

      // ACT
      const items = await bookmarkAccountFindMany(db, { address: bookmark1.address })

      // ASSERT
      expect(items).toHaveLength(1)
      expect(items[0]?.address).toEqual(bookmark1.address)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding bookmark accounts fails', async () => {
      // ARRANGE
      expect.assertions(1)

      vi.spyOn(db.bookmarkAccounts, 'orderBy').mockImplementation(() => ({
        // @ts-expect-error - Mocking Dexie's chained methods confuses Vitest's type inference.
        filter: () => ({
          toArray: () => Promise.reject(new Error('Test error')) as PromiseExtended<BookmarkAccount[]>,
        }),
      }))

      // ACT & ASSERT
      await expect(bookmarkAccountFindMany(db, {})).rejects.toThrow('Error finding bookmark accounts')
    })
  })
})
