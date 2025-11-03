import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbWalletCreate } from '../src/db-wallet-create.ts'
import { dbWalletFindUnique } from '../src/db-wallet-find-unique.ts'
import type { Wallet } from '../src/entity/wallet.ts'
import { createDbTest, testWalletInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-wallet-find-unique', () => {
  beforeEach(async () => {
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should find a unique wallet', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testWalletInputCreate({ accountId: crypto.randomUUID() })
      const id = await dbWalletCreate(db, input)

      // ACT
      const item = await dbWalletFindUnique(db, id)

      // ASSERT
      expect(item).toBeDefined()
      expect(item?.name).toBe(input.name)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when finding a unique wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const id = 'test-id'
      vi.spyOn(db.wallets, 'get').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<undefined | Wallet>,
      )

      // ACT & ASSERT
      await expect(dbWalletFindUnique(db, id)).rejects.toThrow(`Error finding wallet with id ${id}`)
    })
  })
})
