import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountFindMany } from '../src/bookmark-account/bookmark-account-find-many.ts'
import { bookmarkAccountToggle } from '../src/bookmark-account/bookmark-account-toggle.ts'
import { createDbTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-account-toggle', () => {
  beforeEach(async () => {
    await db.bookmarkAccounts.clear()
  })

  describe('expected behavior', () => {
    it('should create a bookmark account if it does not exist', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testBookmarkAccountCreateInput()

      // ACT
      const result = await bookmarkAccountToggle(db, input.address)

      // ASSERT
      const items = await bookmarkAccountFindMany(db, { address: input.address })
      expect(items.map((i) => i.address)).toContain(input.address)
      expect(result).toBe('created')
    })

    it('should delete a bookmark account if it exists', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testBookmarkAccountCreateInput()
      await bookmarkAccountCreate(db, input)

      // ACT
      const result = await bookmarkAccountToggle(db, input.address)

      // ASSERT
      const items = await bookmarkAccountFindMany(db, { address: input.address })
      expect(items.map((i) => i.address)).not.toContain(input.address)
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

    it('should throw an error when toggling an account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkAccountCreateInput()
      vi.spyOn(db.bookmarkAccounts, 'get').mockImplementationOnce(() => {
        throw new Error('Test error')
      })

      // ACT & ASSERT
      await expect(bookmarkAccountToggle(db, input.address)).rejects.toThrow('Error finding bookmark account')
    })
  })
})
