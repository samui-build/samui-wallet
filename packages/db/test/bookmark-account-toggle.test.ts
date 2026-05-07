import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountFindMany } from '../src/bookmark-account/bookmark-account-find-many.ts'
import { bookmarkAccountToggle } from '../src/bookmark-account/bookmark-account-toggle.ts'
import { createAppContextTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const ctx = createAppContextTest()

describe('bookmark-account-toggle', () => {
  beforeEach(async () => {
    await ctx.db.bookmarkAccounts.clear()
  })

  describe('expected behavior', () => {
    it('should create a bookmark account if it does not exist', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testBookmarkAccountCreateInput()

      // ACT
      const result = await bookmarkAccountToggle(ctx, input.address)

      // ASSERT
      const items = await bookmarkAccountFindMany(ctx, { address: input.address })
      expect(items.map((i) => i.address)).toContain(input.address)
      expect(result).toBe('created')
    })

    it('should delete a bookmark account if it exists', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testBookmarkAccountCreateInput()
      await bookmarkAccountCreate(ctx, input)

      // ACT
      const result = await bookmarkAccountToggle(ctx, input.address)

      // ASSERT
      const items = await bookmarkAccountFindMany(ctx, { address: input.address })
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
      vi.spyOn(ctx.db.bookmarkAccounts, 'where').mockImplementationOnce(() => {
        throw new Error('Test error')
      })

      // ACT & ASSERT
      await expect(bookmarkAccountToggle(ctx, input.address)).rejects.toThrow('Test error')
    })
  })
})
