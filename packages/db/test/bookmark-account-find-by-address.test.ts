import { address } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkAccountCreate } from '../src/bookmark-account/bookmark-account-create.ts'
import { bookmarkAccountFindByAddress } from '../src/bookmark-account/bookmark-account-find-by-address.ts'
import { createDbTest, testBookmarkAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-account-find-by-address', () => {
  beforeEach(async () => {
    await db.bookmarkAccounts.clear()
  })

  describe('expected behavior', () => {
    it('should find a bookmark account by address', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testBookmarkAccountCreateInput()
      await bookmarkAccountCreate(db, input)

      // ACT
      const item = await bookmarkAccountFindByAddress(db, input.address)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.address).toEqual(input.address)
    })

    it('should return null if no bookmark account is found', async () => {
      // ARRANGE
      expect.assertions(1)
      const nonExistentAddress = address('So11111111111111111111111111111111111111113')

      // ACT
      const item = await bookmarkAccountFindByAddress(db, nonExistentAddress)

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
      const searchAddress = address('So11111111111111111111111111111111111111112')
      expect.assertions(1)
      vi.spyOn(db.bookmarkAccounts, 'get').mockRejectedValue(new Error('Test error'))

      // ACT & ASSERT
      await expect(bookmarkAccountFindByAddress(db, searchAddress)).rejects.toThrow(
        `Error finding bookmark account with address ${searchAddress}`,
      )
    })
  })
})
