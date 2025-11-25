import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountFindUnique } from '../src/bookmark-account/bookmark-account-find-unique.ts'
import { bookmarkAccountUpdate } from '../src/bookmark-account/bookmark-account-update.ts'
import { createDbTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-account-update', () => {
  let bookmarkId: string

  beforeEach(async () => {
    await db.bookmarkAccounts.clear()
    const bookmark = testBookmarkAccountCreateInput({ label: 'Original Label' })
    bookmarkId = await bookmarkAccountCreate(db, bookmark)
  })

  describe('expected behavior', () => {
    it('should update a bookmark account label', async () => {
      // ARRANGE
      expect.assertions(3)
      const newLabel = 'Updated Label'
      const originalBookmark = await bookmarkAccountFindUnique(db, bookmarkId)

      // ACT
      const result = await bookmarkAccountUpdate(db, bookmarkId, { label: newLabel })
      const updatedBookmark = await bookmarkAccountFindUnique(db, bookmarkId)

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

    it('should throw an error when updating a bookmark account fails', async () => {
      // ARRANGE
      const id = 'test-id'
      expect.assertions(1)
      vi.spyOn(db.bookmarkAccounts, 'update').mockRejectedValue(new Error('Test error'))

      // ACT & ASSERT
      await expect(bookmarkAccountUpdate(db, id, { label: 'new label' })).rejects.toThrow(
        `Error updating bookmark account with id ${id}`,
      )
    })
  })
})
