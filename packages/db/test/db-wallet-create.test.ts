import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { dbPreferenceFindUniqueByKey } from '../src/db-preference-find-unique-by-key'
import { dbWalletCreate } from '../src/db-wallet-create'
import { dbWalletFindMany } from '../src/db-wallet-find-many'
import { dbWalletFindUnique } from '../src/db-wallet-find-unique'
import { createDbTest, testWalletInputCreate } from './test-helpers'

const db = createDbTest()

describe('db-wallet-create', () => {
  beforeEach(async () => {
    await db.preferences.clear()
    await db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should create a wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const accountId = crypto.randomUUID()
      const input = testWalletInputCreate({ accountId })

      // ACT
      await dbWalletCreate(db, input)

      // ASSERT
      const items = await dbWalletFindMany(db, { accountId })
      expect(items.map((i) => i.name)).toContain(input.name)
    })

    it('should create a wallet with a default derivationIndex of 0', async () => {
      // ARRANGE
      expect.assertions(1)
      const accountId = crypto.randomUUID()
      const input = testWalletInputCreate({ accountId })

      // ACT
      const result = await dbWalletCreate(db, input)

      // ASSERT
      const item = await dbWalletFindUnique(db, result)
      expect(item?.derivationIndex).toBe(0)
    })

    it('should create a wallet and set activeWalletId preference', async () => {
      // ARRANGE
      expect.assertions(3)
      const accountId = crypto.randomUUID()
      const input = testWalletInputCreate({ accountId })

      // ACT
      const activeWalletIdBefore = await dbPreferenceFindUniqueByKey(db, 'activeWalletId')
      const result = await dbWalletCreate(db, input)
      const activeWalletIdAfter = await dbPreferenceFindUniqueByKey(db, 'activeWalletId')

      // ASSERT
      const items = await dbWalletFindMany(db, { accountId })
      expect(items.map((i) => i.name)).toContain(input.name)
      expect(activeWalletIdBefore).toBeNull()
      expect(activeWalletIdAfter?.value).toBe(result)
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw an error when creating a wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletInputCreate({ accountId: 'test-account' })
      vi.spyOn(db.wallets, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbWalletCreate(db, input)).rejects.toThrow('Error creating wallet')
    })
  })
})
