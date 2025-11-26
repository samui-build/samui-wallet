import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bookmarkTransactionCreate } from '../src/bookmark-transaction/bookmark-transaction-create.ts'
import { bookmarkTransactionFindMany } from '../src/bookmark-transaction/bookmark-transaction-find-many.ts'
import { createDbTest, testBookmarkTransactionCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('bookmark-transaction-create', () => {
  beforeEach(async () => {
    await db.bookmarkTransactions.clear()
  })

  describe('expected behavior', () => {
    it('should create a bookmarkTransaction', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkTransactionCreateInput()

      // ACT
      await bookmarkTransactionCreate(db, input)

      // ASSERT
      const items = await bookmarkTransactionFindMany(db, { signature: input.signature })
      expect(items.map((i) => i.signature)).toContain(input.signature)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when creating an transaction fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkTransactionCreateInput()
      vi.spyOn(db.bookmarkTransactions, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(bookmarkTransactionCreate(db, input)).rejects.toThrow('Error creating bookmark transaction')
    })

    it('should throw an error when the label is too long', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkTransactionCreateInput({
        label: 'a'.repeat(51),
      })

      // ACT & ASSERT
      await expect(bookmarkTransactionCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
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

    it('should throw an error with an invalid signature', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testBookmarkTransactionCreateInput({
        // @ts-expect-error invalid signature on purpose
        signature: 'invalid-signature',
      })

      // ACT & ASSERT
      await expect(bookmarkTransactionCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "path": [
              "signature"
            ],
            "message": "Invalid Solana signature"
          }
        ]]
      `)
    })
  })
})
