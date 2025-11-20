import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dbWalletCreate } from '../src/db-wallet-create.ts'
import { dbWalletFindMany } from '../src/db-wallet-find-many.ts'
import { dbWalletFindUnique } from '../src/db-wallet-find-unique.ts'
import { settingFindUniqueByKey } from '../src/setting/setting-find-unique-by-key.ts'
import { createDbTest, testWalletInputCreate } from './test-helpers.ts'

const db = createDbTest()

describe('db-wallet-create', () => {
  beforeEach(async () => {
    await db.wallets.clear()
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should create a wallet', async () => {
      // ARRANGE
      expect.assertions(3)
      const input = testWalletInputCreate()

      // ACT
      const result = await dbWalletCreate(db, input)

      // ASSERT
      const item = await dbWalletFindUnique(db, result)
      expect(item?.mnemonic).toBe(input.mnemonic)
      expect(item?.name).toBe(input.name)
      expect(item?.order).toBe(0)
    })

    it('should create a wallet and set activeWalletId setting', async () => {
      // ARRANGE
      expect.assertions(3)
      const input = testWalletInputCreate()
      // ACT
      const activeWalletIdBefore = await settingFindUniqueByKey(db, 'activeWalletId')
      const result = await dbWalletCreate(db, input)
      const activeWalletIdAfter = await settingFindUniqueByKey(db, 'activeWalletId')

      // ASSERT
      const items = await dbWalletFindMany(db)
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
      const input = testWalletInputCreate()
      vi.spyOn(db.wallets, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(dbWalletCreate(db, input)).rejects.toThrow('Error creating wallet')
    })
  })
})
