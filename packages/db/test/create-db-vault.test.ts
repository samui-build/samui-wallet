import { createPasswordWalletProtection } from '@workspace/vault/wallet-protection'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDbVault } from '../src/create-db-vault.ts'
import { randomId } from '../src/random-id.ts'
import { createDbContextTest, randomName } from './test-helpers.ts'

const ctx = createDbContextTest()

describe('create-db-vault', () => {
  beforeEach(async () => {
    await ctx.db.settings.clear()
    await ctx.db.wallets.clear()
  })

  describe('expected behavior', () => {
    it('should create and persist a wrapped vault key', async () => {
      // ARRANGE
      expect.assertions(4)
      const vault = createDbVault({ db: ctx.db })

      // ACT
      await vault.create({ password: 'password-one' })
      const result = await ctx.db.settings.get({ key: 'vaultKey' })

      // ASSERT
      expect(result?.value).toBeDefined()
      expect(result?.value).not.toContain('password-one')
      await expect(vault.isConfigured()).resolves.toBe(true)
      expect(vault.isUnlocked()).toBe(true)
    })

    it('should update the existing vault key setting when the password changes', async () => {
      // ARRANGE
      expect.assertions(4)
      const vault = createDbVault({ db: ctx.db })
      await vault.create({ password: 'password-one' })
      const result1 = await ctx.db.settings.get({ key: 'vaultKey' })

      // ACT
      await vault.changePassword({ newPassword: 'password-two', oldPassword: 'password-one' })
      const result2 = await ctx.db.settings.get({ key: 'vaultKey' })

      // ASSERT
      expect(result2?.id).toBe(result1?.id)
      expect(result2?.value).not.toBe(result1?.value)
      expect(result2?.value).not.toContain('password-two')
      expect(vault.isUnlocked()).toBe(true)
    })

    it('should read wallet protection from a wallet row', async () => {
      // ARRANGE
      expect.assertions(1)
      const now = new Date()
      const walletId = randomId()
      const protection = createPasswordWalletProtection()
      const vault = createDbVault({ db: ctx.db })
      await vault.create({ password: 'password-one' })
      await ctx.db.wallets.add({
        accounts: [],
        createdAt: now,
        derivationPath: 'd',
        id: walletId,
        mnemonic: 'plaintext-mnemonic',
        name: randomName('wallet'),
        order: 0,
        secret: protection,
        updatedAt: now,
      })

      // ACT
      const result = await vault.requireWalletKey({ walletId })

      // ASSERT
      expect(result).toBe(vault.requireDefaultKey())
    })
  })

  describe('unexpected behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should throw when wallet protection is requested for a missing wallet', async () => {
      // ARRANGE
      expect.assertions(1)
      const vault = createDbVault({ db: ctx.db })
      await vault.create({ password: 'password-one' })

      // ACT & ASSERT
      await expect(vault.requireWalletKey({ walletId: 'missing-wallet' })).rejects.toThrow(
        'Wallet with id missing-wallet not found',
      )
    })
  })
})
