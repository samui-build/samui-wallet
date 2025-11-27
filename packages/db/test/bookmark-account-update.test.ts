import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountFindByAddress } from '../src/bookmark-account/bookmark-account-find-by-address.ts'
import { bookmarkAccountUpdate } from '../src/bookmark-account/bookmark-account-update.ts'
import { createDbTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-account-update', () => {
  const input = testBookmarkAccountCreateInput({ label: 'Original Label' })
  let bookmarkId: string

  beforeEach(async () => {
    await db.bookmarkAccounts.clear()
    bookmarkId = await bookmarkAccountCreate(db, input)
  })

  describe('expected behavior', () => {
    it('should update a bookmark account label', async () => {
      // ARRANGE
      expect.assertions(3)
      const newLabel = 'Updated Label'
      const originalBookmark = await bookmarkAccountFindByAddress(db, input.address)

      // ACT
      const result = await bookmarkAccountUpdate(db, bookmarkId, { label: newLabel })
      const updatedBookmark = await bookmarkAccountFindByAddress(db, input.address)

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

    it('should throw an error when the label is too long', async () => {
      // ARRANGE
      expect.assertions(1)
      const newLabel = 'a'.repeat(51)

      // ACT & ASSERT
      await expect(
        bookmarkAccountUpdate(db, bookmarkId, { label: newLabel }),
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
