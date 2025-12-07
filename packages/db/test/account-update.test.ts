import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { accountCreate } from '../src/account/account-create.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { accountUpdate } from '../src/account/account-update.ts'
import { randomId } from '../src/random-id.ts'
import { createDbTest, randomName, testAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('account-update', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should update an account', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testAccountCreateInput({ name: randomName('account'), walletId: randomId() })
      const id = await accountCreate(db, input)
      const newName = randomName('newName')

      // ACT
      await accountUpdate(db, id, { name: newName })

      // ASSERT
      const updatedItem = await accountFindUnique(db, id)
      expect(updatedItem).toBeDefined()
      expect(updatedItem?.name).toBe(newName)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when updating an account with a too short name', async () => {
      // ARRANGE
      expect.assertions(1)

      const id = await accountCreate(db, testAccountCreateInput({ walletId: randomId() }))

      // ACT & ASSERT
      await expect(accountUpdate(db, id, { name: ' ' })).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "origin": "string",
            "code": "too_small",
            "minimum": 1,
            "inclusive": true,
            "path": [
              "name"
            ],
            "message": "Too small: expected string to have >=1 characters"
          }
        ]]
      `)
    })

    it('should throw an error when updating an account with a too long name', async () => {
      // ARRANGE
      expect.assertions(1)

      const id = await accountCreate(db, testAccountCreateInput({ walletId: randomId() }))

      // ACT & ASSERT
      await expect(accountUpdate(db, id, { name: 'a'.repeat(21) })).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "origin": "string",
            "code": "too_big",
            "maximum": 20,
            "inclusive": true,
            "path": [
              "name"
            ],
            "message": "Too big: expected string to have <=20 characters"
          }
        ]]
      `)
    })

    it('should throw an error when updating an account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.accounts, 'update').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<number>,
      )

      // ACT & ASSERT
      await expect(accountUpdate(db, id, {})).rejects.toThrow(`Error updating account with id ${id}`)
    })
  })
})
