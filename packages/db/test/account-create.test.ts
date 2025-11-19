import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accountCreate } from '../src/account/account-create.ts'
import { accountFindMany } from '../src/account/account-find-many.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { dbSettingFindUniqueByKey } from '../src/db-setting-find-unique-by-key.ts'
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
      expect.assertions(1)
      const walletId = crypto.randomUUID()
      const input = testAccountCreateInput({ walletId })

      // ACT
      await accountCreate(db, input)

      // ASSERT
      const items = await accountFindMany(db, { walletId })
      expect(items.map((i) => i.name)).toContain(input.name)
    })

    it('should create an account with a default derivationIndex of 0', async () => {
      // ARRANGE
      expect.assertions(1)
      const walletId = crypto.randomUUID()
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
      const walletId = crypto.randomUUID()
      const input = testAccountCreateInput({ walletId })

      // ACT
      const activeAccountIdBefore = await dbSettingFindUniqueByKey(db, 'activeAccountId')
      const result = await accountCreate(db, input)
      const activeAccountIdAfter = await dbSettingFindUniqueByKey(db, 'activeAccountId')

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
