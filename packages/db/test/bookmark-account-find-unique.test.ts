import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountFindUnique } from '../src/bookmark-account/bookmark-account-find-unique.ts'
import { createDbTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-account-find-unique', () => {
  beforeEach(async () => {
    await db.bookmarkAccounts.clear()
  })

  describe('expected behavior', () => {
    it('should find a bookmark account by id', async () => {
      // ARRANGE
      expect.assertions(2)
      const bookmark1 = testBookmarkAccountCreateInput({ label: 'Account 1' })
      const id1 = await bookmarkAccountCreate(db, bookmark1)

      // ACT
      const item = await bookmarkAccountFindUnique(db, id1)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.id).toEqual(id1)
    })

    it('should return null if no bookmark account is found', async () => {
      // ARRANGE
      expect.assertions(1)

      // ACT
      const item = await bookmarkAccountFindUnique(db, 'non-existent-id')

      // ASSERT
      expect(item).toBeNull()
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding a bookmark account fails', async () => {
      // ARRANGE
      const id = 'test-id'
      expect.assertions(1)
      vi.spyOn(db.bookmarkAccounts, 'get').mockRejectedValue(new Error('Test error'))

      // ACT & ASSERT
      await expect(bookmarkAccountFindUnique(db, id)).rejects.toThrow(`Error finding bookmark account with id ${id}`)
    })
  })
})
