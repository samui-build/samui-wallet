import type { PromiseExtended } from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { walletCreate } from '../src/wallet/wallet-create.ts'
import { walletFindUnique } from '../src/wallet/wallet-find-unique.ts'
import { createDbContextTest, createPasswordTestVault, testWalletCreateInput } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('wallet-create', () => {
  beforeEach(async () => {
    await ctx.db.wallets.clear()
    await createPasswordTestVault(ctx)
  })

  describe('expected behavior', () => {
    it('should create a wallet', async () => {
      // ARRANGE
      expect.assertions(7)
      const input = testWalletCreateInput({ color: 'green' })

      // ACT
      const result = await walletCreate(ctx, input)

      // ASSERT
      const item = await walletFindUnique(ctx, result)
      const raw = await ctx.db.wallets.where('id').equals(result).raw().first()
      const protection = JSON.parse(raw?.secret ?? '{}')
      // @ts-expect-error mnemonic does not exist on the type. Here we ensure it's sanitized.
      expect(item?.mnemonic).toBe(undefined)
      expect(item?.name).toBe(input.name)
      expect(item?.color).toBe('green')
      expect(item?.order).toBe(0)
      expect(raw?.mnemonic).not.toContain(input.mnemonic)
      expect(protection).toEqual({ mode: 'password', version: 1 })
      expect(raw?.secret).not.toContain(input.mnemonic)
    })

    it('should create a wallet with a description', async () => {
      // ARRANGE
      expect.assertions(2)
      const input = testWalletCreateInput({ description: 'foo bar' })

      // ACT
      const result = await walletCreate(ctx, input)

      // ASSERT
      const item = await walletFindUnique(ctx, result)
      expect(item?.description).toBe(input.description)
      expect(item?.name).toBe(input.name)
    })

    it('should create a PIN-protected wallet without requiring the default vault key', async () => {
      // ARRANGE
      expect.assertions(4)
      ctx.vault.lock()
      const input = testWalletCreateInput({ mnemonic: 'test mnemonic', protection: { mode: 'pin', pin: '1234' } })

      // ACT
      const result = await walletCreate(ctx, input)

      // ASSERT
      const raw = await ctx.db.wallets.where('id').equals(result).raw().first()
      const protection = JSON.parse(raw?.secret ?? '{}')
      expect(protection.mode).toBe('pin')
      expect(protection.version).toBe(1)
      expect(raw?.mnemonic).not.toContain(input.mnemonic)
      expect(raw?.secret).not.toContain(input.mnemonic)
    })

    it('should create an unsecured wallet without requiring the default vault key', async () => {
      // ARRANGE
      expect.assertions(5)
      ctx.vault.lock()
      const input = testWalletCreateInput({ mnemonic: 'test mnemonic', protection: { mode: 'unsecured' } })

      // ACT
      const result = await walletCreate(ctx, input)

      // ASSERT
      const raw = await ctx.db.wallets.where('id').equals(result).raw().first()
      const protection = JSON.parse(raw?.secret ?? '{}')
      expect(protection.keyMaterial).toBeTypeOf('string')
      expect(protection.mode).toBe('unsecured')
      expect(protection.version).toBe(1)
      expect(raw?.mnemonic).not.toContain(input.mnemonic)
      expect(raw?.secret).not.toContain(input.mnemonic)
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
      await expect(walletCreate(ctx, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
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
      await expect(walletCreate(ctx, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
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
      await expect(walletCreate(ctx, input)).rejects.toThrowErrorMatchingInlineSnapshot(`
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

    it('should throw an error when creating a PIN wallet with a non-digit PIN', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput({ protection: { mode: 'pin', pin: 'abcd' } })

      // ACT & ASSERT
      await expect(walletCreate(ctx, input)).rejects.toThrow('PIN must contain only digits')
    })

    it('should throw an error when creating a PIN wallet with a too short PIN', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput({ protection: { mode: 'pin', pin: '123' } })

      // ACT & ASSERT
      await expect(walletCreate(ctx, input)).rejects.toThrow('PIN must be at least 4 digits')
    })

    it('should throw an error when creating a wallet fails', async () => {
      // ARRANGE
      expect.assertions(1)
      const input = testWalletCreateInput()
      vi.spyOn(ctx.db.wallets, 'add').mockImplementationOnce(
        () => Promise.reject(new Error('Test error')) as PromiseExtended<string>,
      )

      // ACT & ASSERT
      await expect(walletCreate(ctx, input)).rejects.toThrow('Error creating wallet')
    })

    it('should throw when creating a password wallet while the vault is locked', async () => {
      // ARRANGE
      expect.assertions(1)
      ctx.vault.lock()
      const input = testWalletCreateInput()

      // ACT & ASSERT
      await expect(walletCreate(ctx, input)).rejects.toThrow('Vault is locked')
    })
  })
})
