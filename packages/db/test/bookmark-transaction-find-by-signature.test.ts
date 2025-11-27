import { signature } from '@solana/kit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkTransactionCreate } from '../src/bookmark-transaction/bookmark-transaction-create.ts'
import { bookmarkTransactionFindBySignature } from '../src/bookmark-transaction/bookmark-transaction-find-by-signature.ts'
import { createDbTest, testBookmarkTransactionCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-transaction-find-by-signature', () => {
  beforeEach(async () => {
    await db.bookmarkTransactions.clear()
  })

  describe('expected behavior', () => {
    it('should find a bookmark transaction by signature', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testBookmarkTransactionCreateInput()
      await bookmarkTransactionCreate(db, input)

      // ACT
      const item = await bookmarkTransactionFindBySignature(db, input.signature)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.signature).toEqual(input.signature)
    })

    it('should return null if no bookmark transaction is found', async () => {
      // ARRANGE
      expect.assertions(1)
      const nonExistentSignature = signature(
        '67QRhaJuZeRqoSiifT6yKfuQTUKfvu2exuppyNyT7r2sQCXfBBpr96mdF5TurVDKdWsZ48nx9u5r9uJ87SG9PfvU',
      )

      // ACT
      const item = await bookmarkTransactionFindBySignature(db, nonExistentSignature)

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

    it('should throw an error when finding a bookmark transaction fails', async () => {
      // ARRANGE
      const searchSignature = signature(
        '67QRhaJuZeRqoSiifT6yKfuQTUKfvu2exuppyNyT7r2sQCXfBBpr96mdF5TurVDKdWsZ48nx9u5r9uJ87SG9PfvU',
      )
      expect.assertions(1)
      vi.spyOn(db.bookmarkTransactions, 'get').mockRejectedValue(new Error('Test error'))

      // ACT & ASSERT
      await expect(bookmarkTransactionFindBySignature(db, searchSignature)).rejects.toThrow(
        `Error finding bookmark transaction with signature ${searchSignature}`,
      )
    })
  })
})
