import type { PromiseExtended } from 'dexie'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { settingFindUniqueByKey } from '../src/setting/setting-find-unique-by-key.ts'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletFindMany } from '../src/wallet/wallet-find-many.ts'
import { walletFindUnique } from '../src/wallet/wallet-find-unique.ts'
import { createDbTest, testWalletCreateInput } from './test-helpers.ts'

const db = createDbTest()

describe('wallet-create', () => {
  beforeEach(async () => {
    await db.wallets.clear()
    await db.settings.clear()
  })

  describe('expected behavior', () => {
    it('should create a wallet', async () => {
      // ARRANGE
      expect.assertions(4)
      const input = testWalletCreateInput({ color: 'green' })

      // ACT
      const result = await walletCreate(db, input)

      // ASSERT
      const item = await walletFindUnique(db, result)
      // @ts-expect-error mnemonic does not exist on the type. Here we ensure it's sanitized.
      expect(item?.mnemonic).toBe(undefined)
      expect(item?.name).toBe(input.name)
      expect(item?.color).toBe('green')
      expect(item?.order).toBe(0)
    })

    it('should create a wallet with a description', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testWalletCreateInput({ description: 'foo bar' })

      // ACT
      const result = await walletCreate(db, input)

      // ASSERT
      const item = await walletFindUnique(db, result)
      expect(item?.description).toBe(input.description)
      expect(item?.name).toBe(input.name)
    })

    it('should create a wallet and set activeWalletId setting', async () => {
      // ARRANGE
      expect.assertions(3)
      const input = testWalletCreateInput()
      // ACT
      const activeWalletIdBefore = await settingFindUniqueByKey(db, 'activeWalletId')
      const result = await walletCreate(db, input)
      const activeWalletIdAfter = await settingFindUniqueByKey(db, 'activeWalletId')

      // ASSERT
      const items = await walletFindMany(db)
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

    it('should throw an error when creating a wallet with a too short name', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput({ name: ' ' })

      // ACT & ASSERT
      await expect(walletCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
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

    it('should throw an error when creating a wallet with a too long name', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput({ name: 'a'.repeat(21) })

      // ACT & ASSERT
      await expect(walletCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
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

    it('should throw an error when creating a wallet with a too long description', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput({ description: 'a'.repeat(51) })

      // ACT & ASSERT
      await expect(walletCreate(db, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "origin": "string",
            "code": "too_big",
            "maximum": 50,
            "inclusive": true,
            "path": [
              "description"
            ],
            "message": "Too big: expected string to have <=50 characters"
          }
        ]]
      `)
    })

    it('should throw an error when creating a wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput()
      vi.spyOn(db.wallets, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(walletCreate(db, input)).rejects.toThrow('Error creating wallet')
    })
  })
})
