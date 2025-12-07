import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountFindMany } from '../src/account/account-find-many.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { randomId } from '../src/random-id.ts'
import { settingFindUniqueByKey } from '../src/setting/setting-find-unique-by-key.ts'
import { createDbTest, testAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('account-create', () => {
  beforeEach(async () => {
    await db.accounts.clear()
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should create an account', async () => {
      // ARRANGE
      expect.assertions(2)
      const walletId = randomId()
      const input = testAccountCreateInput({ walletId })

      // ACT
      const result = await accountCreate(db, input)

      // ASSERT
      const item = await accountFindUnique(db, result)
      expect(item?.name).toEqual(input.name)
      // @ts-expect-error secretKey does not exist on the type. Here we ensure it's sanitized.
      expect(item?.secretKey).toBeUndefined()
    })

    it('should create an account with a default derivationIndex of 0', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = randomId()
      const input = testAccountCreateInput({ walletId })

      // ACT
      const result = await accountCreate(db, input)

      // ASSERT
      const item = await accountFindUnique(db, result)
      expect(item?.derivationIndex).toBe(0)
    })

    it('should create an account and set activeAccountId setting', async () => {
      // ARRANGE
      expect.assertions(3)
      const walletId = randomId()
      const input = testAccountCreateInput({ walletId })

      // ACT
      const activeAccountIdBefore = await settingFindUniqueByKey(db, 'activeAccountId')
      const result = await accountCreate(db, input)
      const activeAccountIdAfter = await settingFindUniqueByKey(db, 'activeAccountId')

      // ASSERT
      const items = await accountFindMany(db, { walletId })
      expect(items.map((i) => i.name)).toContain(input.name)
      expect(activeAccountIdBefore).toBeNull()
      expect(activeAccountIdAfter?.value).toBe(result)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when creating an account with a too short name', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testAccountCreateInput({ name: ' ', walletId: randomId() })

      // ACT & ASSERT
      await expect(accountCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
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

    it('should throw an error when creating an account with a too long name', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testAccountCreateInput({ name: 'a'.repeat(21), walletId: randomId() })

      // ACT & ASSERT
      await expect(accountCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
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

    it('should throw an error when creating an account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testAccountCreateInput({ walletId: 'test-wallet' })
      vi.spyOn(db.accounts, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(accountCreate(db, input)).rejects.toThrow('Error creating account')
    })
  })
})
