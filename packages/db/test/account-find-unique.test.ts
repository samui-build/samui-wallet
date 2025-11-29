import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Account } from '../src/account/account.ts'
import { accountCreate } from '../src/account/account-create.ts'
import { accountFindUnique } from '../src/account/account-find-unique.ts'
import { randomId } from '../src/random-id.ts'
import { createDbTest, testAccountCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('account-find-unique', () => {
  beforeEach(async () => {
    await db.accounts.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique account', async () => {
      // ARRANGE
      expect.assertions(3)
      const input = testAccountCreateInput({ walletId: randomId() })
      const id = await accountCreate(db, input)

      // ACT
      const item = await accountFindUnique(db, id)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.name).toBe(input.name)
      // @ts-expect-error secretKey does not exist on the type. Here we ensure it's sanitized.
      expect(item?.secretKey).toBe(undefined)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding a unique account fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.accounts, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<undefined | Account>,
      )

      // ACT & ASSERT
      await expect(accountFindUnique(db, id)).rejects.toThrow(`Error finding account with id ${id}`)
    })
  })
})
